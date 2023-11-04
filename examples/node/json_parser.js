import JSONparser from '../../dist/node/JSONparser.js';

function setup() {
    const example_1 = `{"hello":"world"}`
    const data_1 = JSONparser(example_1);
    console.log(data_1);

    const example_2 = `Sure here is some JSON\n{"hello":"parsed"}`
    const data_2 = JSONparser(example_2);
    console.log(data_2);

    const example_3 = `Sure here is some JSON\n{"hello":"parsed 1234"}\nvery cool`
    const data_3 = JSONparser(example_3);
    console.log(data_3);
}
setup();