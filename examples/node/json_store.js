import JSONstore from "../../dist/node/json_store.js";

async function setup() {
  const store = new JSONstore("./test-store.json");
  await store.load();

  await store.clear();

  if (!store.has("hello")) {
    store.set("hello", "world");
  }

  const data = store.get("hello");
  console.log(data);

  store.remove("hello");

  const no_data = await store.get("hello");
  console.log("no_data", no_data);

  // truncate the store
  // await store.destory()

  store.set("appending-array", ["hello"]);
  store.append("appending-array", ["world"]);
  console.log(store.get("appending-array"));

  store.append("my_object", { key: "initial value" });
  store.append("my_object", { another_key: "next value" });

  console.log(store.get("my_object")); // { key: "initial value", another_key: "next value" }

  store.append("my_string", "initial value");
  store.append("my_string", "next value");
  console.log(store.get("my_string")); // "initial valuenext value"

  store.append("my_number", 1);
  store.append("my_number", 2);
  console.log(store.get("my_number")); // 3

  await store.save();
}
setup();
