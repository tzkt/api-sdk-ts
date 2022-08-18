import { blocksGet } from "./packages/sdk-api/src/index";

const init = async () => {
    const r = blocksGet({
        anyof: {
            null: true,
            fields: ['proposer', 'producer']
        },
        limit: 50,
        level: {
            lt: 1000000
        }
    })
};

init();