import "core-js/stable";
import "regenerator-runtime/runtime";
import { processTest} from './test.fixture';

// EDIT THIS: Replace with your contract address
const contractAddr = "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4";
// EDIT THIS: Replace `boilerplate` with your plugin name
const abi_path = '../compound/abis/' + contractAddr + '.json';
const rawTxHex = "0x02f890012c843b9aca008505616adcb48302ee149470e36f6bf80a52b3b46b3af8e106cc0ed743e8e480a40e75270200000000000000000000000000000000000000000000000006d660efa683526ec080a0cc314148699d9196704ab35eb49152a2da323cb93a3f8490dede87f3ca44998fa02597356ef56706d70285adcd334ee9ad570523ec36105dac09b782a8ebf5c7eb";
const testLabel = "repay_borrow";
const testNetwork = "ethereum";
const signedPlugin = false;
const contractName = "Compound"
const devices = [
  {
    name: "nanos",
    label: "nano S",
    steps: 6
  }
];
// Reference transaction for this test:
// https://etherscan.io/tx/0x863beb87fc6fa03b6557530142a3e134c3890a8922bab0df5802e4d11a13e4b8

  devices.forEach((device) =>  processTest(device, contractName, testLabel, rawTxHex, signedPlugin,"",testNetwork));