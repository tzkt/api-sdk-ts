import * as signalR from "@microsoft/signalr";
import {
    EventsConfig,
    Message,
    OperationKind,
    TezosOperation,
    OperationSubscriptionParameters,
    BigMapSubscriptionParameters,
    TokenTransferSubscriptionParameters,
    SubscriptionParameters,
    ResponseTypes,
    CHANNEL,
    channelToMethod,
    EventType,
    Event,
} from './types';
import Observable from "zen-observable";
import { 
    State, 
    Block, 
    BigMapUpdate, 
    TokenTransfer,
    ActivationOperation,
    BallotOperation,
    DelegationOperation,
    DoubleBakingOperation,
    DoubleEndorsingOperation,
    EndorsementOperation,
    NonceRevelationOperation,
    OriginationOperation,
    ProposalOperation,
    RevealOperation,
    TransactionOperation,
    RegisterConstantOperation,
    PreendorsementOperation,
    DoublePreendorsingOperation,
    RevelationPenaltyOperation,
    SetDepositsLimitOperation,
    MigrationOperation,
    EndorsingRewardOperation,
    BakingOperation
} from '@tzkt/sdk-api';


export type StatusObservable = Observable<signalR.HubConnectionState>;
export type EventObservable = Observable<Event>;
export type StateObservable = Observable<SubscriptionMessage<State>>;
export type BlockObservable = Observable<SubscriptionMessage<Block>>;
export type OperationObservable = Observable<SubscriptionMessage<TezosOperation>>;
export type BigMapObservable = Observable<SubscriptionMessage<BigMapUpdate>>;
export type TokenTransferObservable = Observable<SubscriptionMessage<TokenTransfer>>;
export type ZenSubscription = ZenObservable.Subscription;


export class EventsService {
    private connection: signalR.HubConnection;
    private subscriptions: Set<Subscription<any>>;
    private networkEvents: Observable<Event>;
    private statusChanges: Observable<signalR.HubConnectionState>;
    private eventObservers: Set<ZenObservable.Observer<Event>>;
    private statusObservers: Set<ZenObservable.Observer<signalR.HubConnectionState>>

    constructor({ url, reconnect = true }: EventsConfig) {
        this.subscriptions = new Set<Subscription<any>>();
        this.eventObservers = new Set<ZenObservable.Observer<Event>>();
        this.statusObservers = new Set<ZenObservable.Observer<signalR.HubConnectionState>>();

        let builder = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Error)
            .withUrl(url);

        if (reconnect) {
            builder = builder.withAutomaticReconnect({
                nextRetryDelayInMilliseconds: ctx => {
                    // TODO: better policy
                    return ctx.elapsedMilliseconds < 10000 ? 1000 : 5000;
                }
            });
        }

        this.connection = builder.build();

        this.connection.on(CHANNEL.HEAD, msg => this.onMessage(CHANNEL.HEAD, msg));
        this.connection.on(CHANNEL.BLOCKS, msg => this.onMessage(CHANNEL.BLOCKS, msg));
        this.connection.on(CHANNEL.OPERATIONS, msg => this.onMessage(CHANNEL.OPERATIONS, msg));
        this.connection.on(CHANNEL.BIGMAPS, msg => this.onMessage(CHANNEL.BIGMAPS, msg));
        this.connection.on(CHANNEL.TRANSFERS, msg => this.onMessage(CHANNEL.TRANSFERS, msg));

        this.connection.onclose(() => this.onStatusChanged(signalR.HubConnectionState.Disconnected));
        this.connection.onreconnecting(() => this.onStatusChanged(signalR.HubConnectionState.Reconnecting));

        if (reconnect) {
            this.connection.onreconnected(async () => {
                this.onStatusChanged(signalR.HubConnectionState.Connected);
                this.subscriptions.forEach(async sub => await this.invoke(sub), this);
            })
        } else {
            this.connection.onreconnected(() => this.onStatusChanged(signalR.HubConnectionState.Connected));
        }

        this.networkEvents = new Observable<Event>(observer => {
            this.eventObservers.add(observer);
            return () => {
                this.eventObservers.delete(observer);
            }
        });

        this.statusChanges = new Observable<signalR.HubConnectionState>(observer => {
            this.statusObservers.add(observer);
            return () => {
                this.statusObservers.delete(observer);
            }
        });
    }

    public async start(): Promise<void> {
        switch (this.connection.state) {
            case signalR.HubConnectionState.Disconnected: {
                this.onStatusChanged(signalR.HubConnectionState.Connecting);
                await this.connection.start();
                this.onStatusChanged(signalR.HubConnectionState.Connected);
                break;
            }
            case signalR.HubConnectionState.Connected: break;
            default: throw new Error(`Intermediate connection hub state: ${this.connection.state}`);
        }
    }

    public async stop() {
        switch (this.connection.state) {
            case signalR.HubConnectionState.Disconnected: break;
            case signalR.HubConnectionState.Connected: {
                this.onStatusChanged(signalR.HubConnectionState.Disconnecting);
                await this.connection.stop();
                this.subscriptions.forEach(sub => {
                    if (sub.observer.complete) {
                        sub.observer.complete();
                    }
                }, this);
                this.subscriptions.clear();
                break;
            }
            default: throw new Error(`Intermediate connection hub state: ${this.connection.state}`);
        }
    }

    private async invoke(sub: Subscription<any>) {
        if (sub.params) {
            return await this.connection.invoke(sub.method, sub.params);
        }
        return await this.connection.invoke(sub.method);
    }

    /**
     * Subscribe to connection status changes
     */
    public status(): StatusObservable {
        return this.statusChanges;
    }

    /**
     * Subscribe to raw TzKT events (init, rollback message types)
     */
    public events(): EventObservable {
        return this.networkEvents;
    }

    /*
     * head
     */
    public head(): StateObservable {
        return new Observable<SubscriptionMessage<State>>(observer => {
            return this.createSubscription<State>(CHANNEL.HEAD, observer);
        })
    }

    /*
     * blocks
     */
    public blocks(): BlockObservable {
        return new Observable<SubscriptionMessage<Block>>(observer => {
            return this.createSubscription<Block>(CHANNEL.BLOCKS, observer);
        })
    }

    /*
     * operations
     */
    public operations(params: OperationSubscriptionParameters): OperationObservable {
        return new Observable<SubscriptionMessage<TezosOperation>>(observer => {
            return this.createSubscription<TezosOperation>(CHANNEL.OPERATIONS, observer, params);
        })
    }

    /*
     * bigmaps
     */
    public bigmaps(params: BigMapSubscriptionParameters): BigMapObservable {
        return new Observable<SubscriptionMessage<BigMapUpdate>>(observer => {
            return this.createSubscription<BigMapUpdate>(CHANNEL.BIGMAPS, observer, params);
        })
    }

    /*
     * transfers
     */
    public transfers(params: TokenTransferSubscriptionParameters): TokenTransferObservable {
        return new Observable<SubscriptionMessage<TokenTransfer>>(observer => {
            return this.createSubscription<TokenTransfer>(CHANNEL.TRANSFERS, observer, params);
        })
    }

    private createSubscription<Type>(
        channel: CHANNEL, 
        observer: ZenObservable.Observer<SubscriptionMessage<Type>>, 
        params?: SubscriptionParameters
    ): () => void {
        const subscription = new Subscription<Type>(channel, observer, params);
        this.subscriptions.add(subscription);

        this.start()
            .then(() => this.invoke(subscription))
            .catch(error => { throw new Error(error) });

        return () => {
            this.subscriptions.delete(subscription);
            if (subscription.observer.complete) {
                subscription.observer.complete();
            }
        }
    }

    private handle(channel: CHANNEL, items: Array<ResponseTypes>, state: number) {
        items.forEach(item => {
            this.subscriptions.forEach(sub => {
                if (sub.observer.next && sub.match(channel, item)) {
                    sub.observer.next({
                        data: item,
                        state: state
                    });
                }
            })
        }, this);
    }

    private onMessage(channel: CHANNEL, message: Message) {
        switch (message.type) {
            case EventType.Init: {
                this.onEvent(message);
                break;
            }
            case EventType.Data: {
                this.handle(channel, [message.data as State], message.state);
                break;
            }
            case EventType.Reorg: {
                this.onEvent(message);
                break;
            }
        }
    }

    private onEvent(event: Event) {
        this.eventObservers.forEach(o => {
            if (o.next) {
                o.next(event);
            }
        });
    }

    private onStatusChanged(status: signalR.HubConnectionState) {
        this.statusObservers.forEach(o => {
            if (o.next) {
                o.next(status);
            }
        });
    }
}

export interface SubscriptionMessage<Type> {
    data: Type | null,
    state: number
}

class Subscription<Type> {
    method: string;

    constructor(
        private channel: CHANNEL, 
        public observer: ZenObservable.Observer<SubscriptionMessage<Type>>, 
        public params?: SubscriptionParameters)
    {
        this.method = channelToMethod(channel);
    }

    public match(channel: CHANNEL, item: ResponseTypes): boolean {
        if (this.channel !== channel) {
            return false;
        }
        if (this.params) {
            switch (channel) {
                case CHANNEL.OPERATIONS: return this.matchOperation(item as TezosOperation, this.params as OperationSubscriptionParameters);
                case CHANNEL.BIGMAPS: return this.matchBigMapUpdate(item as BigMapUpdate, this.params as BigMapSubscriptionParameters);
                case CHANNEL.TRANSFERS: return this.matchTokenTransfer(item as TokenTransfer, this.params as TokenTransferSubscriptionParameters);
            }
        }
        return true;
    }

    private matchOperation(operation: TezosOperation, params: OperationSubscriptionParameters): boolean {
        if (params.types && !params.types.includes(operation.type as OperationKind)) {
            return false;
        }
        if (params.address) {            
            switch (operation.type) {
                case 'endorsement': return (operation as EndorsementOperation).delegate?.address === params.address;
                case 'preendorsement': return (operation as PreendorsementOperation).delegate?.address === params.address;
                case 'ballot': return (operation as BallotOperation).delegate?.address === params.address;
                case 'proposal': return (operation as ProposalOperation).delegate?.address === params.address;
                case 'activation': return (operation as ActivationOperation).account?.address === params.address;
                case 'double_baking': {
                    const op = operation as DoubleBakingOperation;
                    return op.offender?.address === params.address || op.accuser?.address === params.address;
                }
                case 'double_endorsing': {
                    const op = operation as DoubleEndorsingOperation;
                    return op.offender?.address === params.address || op.accuser?.address === params.address;
                }
                case 'double_preendorsing': {
                    const op = operation as DoublePreendorsingOperation;
                    return op.offender?.address === params.address || op.accuser?.address === params.address;
                }
                case 'nonce_revelation': {
                    const op = operation as NonceRevelationOperation;
                    return op.baker?.address === params.address || op.sender?.address === params.address;
                }
                case 'delegation': return (operation as DelegationOperation).sender?.address === params.address;
                case 'origination': {
                    const op = operation as OriginationOperation;
                    return op.sender?.address === params.address || op.originatedContract?.address === params.address;
                }
                case 'transaction': {
                    const op = operation as TransactionOperation;
                    return op.sender?.address === params.address || op.target?.address === params.address;
                }
                case 'reveal': return (operation as RevealOperation).sender?.address === params.address;
                case 'register_constant': return (operation as RegisterConstantOperation).sender?.address === params.address;
                case 'set_deposits_limit': return (operation as SetDepositsLimitOperation).sender?.address === params.address;
                case 'migration': return (operation as MigrationOperation).account?.address === params.address;
                case 'revelation_penalty': return (operation as RevelationPenaltyOperation).baker?.address === params.address;
                case 'baking': {
                    const op = operation as BakingOperation;
                    return op.proposer?.address === params.address || op.producer?.address === params.address;
                }
                case 'endorsing_reward': return (operation as EndorsingRewardOperation).baker?.address === params.address;
            }
        }
        return true;
    }

    private matchBigMapUpdate(update: BigMapUpdate, params: BigMapSubscriptionParameters): boolean {
        if (params.contract) {
            if (params.contract !== update.contract) { return false; }
        }
        if (params.ptr) {
            if (params.ptr !== update.bigmap) { return false; }
        }
        if (params.path) {
            if (!update.path?.startsWith(params.path)) { return false; }
        }
        // TODO: filter by tags
        return true;
    }

    private matchTokenTransfer(transfer: TokenTransfer, params: TokenTransferSubscriptionParameters): boolean {
        if (params.account) {
            if (params.account !== transfer.from && params.account !== transfer.to) { return false; }
        }
        if (params.contract) {
            if (params.contract !== transfer.token?.contract) { return false; }
        }
        if (params.tokenId) {
            if (params.tokenId !== transfer.token?.tokenId) { return false; }
        }
        return true;
    }
}