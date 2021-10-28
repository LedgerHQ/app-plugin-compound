import "core-js/stable";
import "regenerator-runtime/runtime";
import Eth from "@ledgerhq/hw-app-eth";
import Zemu from "@zondax/zemu";
import { expect } from "../jest";

const {NANOS_ETH_ELF_PATH, NANOX_ETH_ELF_PATH, NANOS_COMPOUND_LIB, NANOX_COMPOUND_LIB, sim_options_nanos, sim_options_nanox, TIMEOUT, getTmpPath} = require("generic.js");

const ORIGINAL_SNAPSHOT_PATH_PREFIX = "snapshots/manual_vote/";

const ORIGINAL_SNAPSHOT_PATH_NANOS = ORIGINAL_SNAPSHOT_PATH_PREFIX + "nanos/";
const ORIGINAL_SNAPSHOT_PATH_NANOX = ORIGINAL_SNAPSHOT_PATH_PREFIX + "nanox/";

test("recipient nanos", async () => {
  jest.setTimeout(TIMEOUT);

  const sim = new Zemu(NANOS_ETH_ELF_PATH, NANOS_COMPOUND_LIB);

  let tmpPath = getTmpPath(expect.getState().currentTestName);

  try {
    await sim.start(sim_options_nanos);

    let transport = await sim.getTransport();
    const eth = new Eth(transport);

    // Send transaction
    let tx = eth.signTransaction("44'/60'/0'/1/0", "F8494A8502540BE400830222E0947F39C581F595B53C5CB19BD0B3F8DA6C935E2CA080A4EA598CB0000000000000000000000000000000000000000000000000016345785D89FFFF018080");

    let filename;

    await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot());
    // review tx
    filename = "review.png";
    await sim.snapshot(tmpPath + filename);
    const review = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_review = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOS + filename);
    expect(review).toMatchSnapshot(expected_review);

    // Compound message
    filename = "compound.png";
    await sim.clickRight(tmpPath + filename);
    const compound = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_compound = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOS + filename);
    expect(compound).toMatchSnapshot(expected_compound);

    // proposal id
    filename = "proposal_id.png";
    await sim.clickRight(tmpPath + filename);
    const proposal_id= Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_proposal_id = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOS + filename);
    expect(proposal_id).toMatchSnapshot(expected_proposal_id);

    // support
    filename = "support.png";
    await sim.clickRight(tmpPath + filename);
    const support = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_support = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOS + filename);
    expect(support).toMatchSnapshot(expected_support);

    // Max Fees
    filename = "fees.png";
    await sim.clickRight(tmpPath + filename);
    const fees = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_fees = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOS + filename);
    expect(fees).toMatchSnapshot(expected_fees);

    // Accept
    filename = "accept.png";
    await sim.clickRight(tmpPath + filename);
    const accept = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_accept = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOS + filename);
    expect(accept).toMatchSnapshot(expected_accept);

    await sim.clickBoth();

    await expect(tx).resolves.toEqual(
      {
        'r': 'fc7934a8c6bef19d4469594c16c4fe9bf67f2ef39436aac9223629e25e43da95',
        's': '10efe59dd11ef682acdeb74ad0f9139c10aaa77646f78b2e76ddf77534433180',
        'v': '25'
      }
    );
  } finally {
    await sim.close();
  }
});

test.skip("recipient nanox", async () => {
  jest.setTimeout(TIMEOUT);

  const sim = new Zemu(NANOX_ETH_ELF_PATH, NANOX_COMPOUND_LIB);

    let tmpPath = getTmpPath(expect.getState().currentTestName);

  try {
    await sim.start(sim_options_nanox);

    let transport = await sim.getTransport();
    const eth = new Eth(transport);

    // Send transaction
    let tx = eth.signTransaction("44'/60'/0'/1/0", "F8494A8502540BE400830222E0947F39C581F595B53C5CB19BD0B3F8DA6C935E2CA080A4EA598CB0000000000000000000000000000000000000000000000000016345785D89FFFF018080");

    let filename;

    await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot());
    // Review tx
    filename = "review.png";
    await sim.snapshot(tmpPath + filename);
    const review = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_review = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOX + filename);
    expect(review).toMatchSnapshot(expected_review);

    // Compound message
    filename = "compound.png";
    await sim.clickRight(tmpPath + filename);
    const lido = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_lido = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOX + filename);
    expect(lido).toMatchSnapshot(expected_lido);

    // recipient
    filename = "recipient.png";
    await sim.clickRight(tmpPath + filename);
    const recipient = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_recipient = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOX + filename);
    expect(recipient).toMatchSnapshot(expected_recipient);

    // Max Fees
    filename = "fees.png";
    await sim.clickRight(tmpPath + filename);
    const fees = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_fees = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOX + filename);
    expect(fees).toMatchSnapshot(expected_fees);

    // Accept
    filename = "accept.png";
    await sim.clickRight(tmpPath + filename);
    const accept = Zemu.LoadPng2RGB(tmpPath + filename);
    const expected_accept = Zemu.LoadPng2RGB(ORIGINAL_SNAPSHOT_PATH_NANOX + filename);
    expect(accept).toMatchSnapshot(expected_accept);

    await sim.clickBoth();

    await expect(tx).resolves.toEqual(
      {
        'r': 'fc7934a8c6bef19d4469594c16c4fe9bf67f2ef39436aac9223629e25e43da95',
        's': '10efe59dd11ef682acdeb74ad0f9139c10aaa77646f78b2e76ddf77534433180',
        'v': '25'
      }
    );
  } finally {
    await sim.close();
  }
});