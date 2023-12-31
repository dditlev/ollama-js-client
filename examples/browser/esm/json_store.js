import JSONstore from '../../../dist/browser/json_store.js';

async function setup() {

    const store = new JSONstore("./test-store.json");

    await store.clear()

    if (! store.has("hello")) {
        store.set("hello","world");
    }

    const data = store.get("hello");
    console.log(data);

    store.remove("hello");

    const no_data = await store.get("hello");
    console.log("no_data",no_data);


    // truncate the store
    // await store.destory()

    store.set("appending-array",["hello"])
    store.append("appending-array",["world"])
    console.log(store.get("appending-array"))

    await store.save()

    // browser only: download the store
    await store.download()


}
setup();