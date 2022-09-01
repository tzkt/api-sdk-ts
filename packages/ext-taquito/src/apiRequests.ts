import Axios from 'axios';
import {BigNumber} from "bignumber.js";

class ApiRequests {
  private readonly _apiUrl: string;
  private readonly apiVersion: string = 'v1'

  constructor(apiUrl: string) {
    this._apiUrl = `${apiUrl}/${this.apiVersion}`
  }

  async getBalance(address: string): Promise<BigNumber> {
    const {data} = await Axios.get(`${this._apiUrl}/accounts/${address}/balance`);
    return new BigNumber(data);
  }

  async getDelegate(address: string): Promise<string | null> {
    const {data} = await Axios.get(`${this._apiUrl}/accounts/${address}`);

    return data?.delegate?.address
  }

  async getNextProtocol(): Promise<string> {
    const {data} = await Axios.get(`${this._apiUrl}/protocols/current`);

    return data?.hash
  }
}

export {ApiRequests}
