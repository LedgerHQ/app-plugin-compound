#include "compound_plugin.h"

#define NUM_SELECTORS 11
// List of selectors supported by this plugin.
// EDIT THIS: Adapt the variable names and change the `0x` values to match your selectors.

/* From contract: https://etherscan.io/address/0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4#code */
static const uint8_t COMPOUND_APPROVE_SELECTOR[SELECTOR_SIZE] = {0x09, 0x5e, 0xa7, 0xb3};
static const uint8_t COMPOUND_REDEEM_UNDERLYING_SELECTOR[SELECTOR_SIZE] = {0x85, 0x2a, 0x12, 0xe3};
static const uint8_t COMPOUND_REDEEM_SELECTOR[SELECTOR_SIZE] = {0xdb, 0x00, 0x6a, 0x75};
static const uint8_t COMPOUND_MINT_SELECTOR[SELECTOR_SIZE] = {0xa0, 0x71, 0x2d, 0x68};
static const uint8_t COMPOUND_BORROW_SELECTOR[SELECTOR_SIZE] = {0xc5, 0xeb, 0xea, 0xec};
static const uint8_t COMPOUND_REPAY_BORROW_SELECTOR[SELECTOR_SIZE] = {0x0e, 0x75, 0x27, 0x02};
static const uint8_t COMPOUND_TRANSFER_SELECTOR[SELECTOR_SIZE] = {0xa9, 0x05, 0x9c, 0xbb};
static const uint8_t COMPOUND_REPAY_BORROW_ON_BEHALF_SELECTOR[SELECTOR_SIZE] = {0x26,
                                                                                0x08,
                                                                                0xf8,
                                                                                0x18};
static const uint8_t COMPOUND_LIQUIDATE_BORROW_SELECTOR[SELECTOR_SIZE] = {0xf5, 0xe3, 0xc4, 0x62};
static const uint8_t COMPOUND_VOTE_DELEGATE_SELECTOR[SELECTOR_SIZE] = {0x5c, 0x19, 0xa9, 0x5c};
// function `deletegateBySig`
static const uint8_t COMPOUND_MANUAL_VOTE_SELECTOR[SELECTOR_SIZE] = {0x56, 0x78, 0x13, 0x88};

// Array of all the different boilerplate selectors. Make sure this follows the same order as
// the enum defined in `compound_plugin.h` EDIT THIS: Use the names of the array declared above.
const uint8_t *const COMPOUND_SELECTORS[NUM_SELECTORS] = {
    COMPOUND_REDEEM_UNDERLYING_SELECTOR,
    COMPOUND_REDEEM_SELECTOR,
    COMPOUND_MINT_SELECTOR,
    COMPOUND_BORROW_SELECTOR,
    COMPOUND_REPAY_BORROW_SELECTOR,
    COMPOUND_REPAY_BORROW_ON_BEHALF_SELECTOR,
    COMPOUND_TRANSFER_SELECTOR,
    COMPOUND_LIQUIDATE_BORROW_SELECTOR,
    COMPOUND_MANUAL_VOTE_SELECTOR,
    COMPOUND_VOTE_DELEGATE_SELECTOR,
};

// Called once to init.
void handle_init_contract(void *parameters) {
    // Cast the msg to the type of structure we expect (here, ethPluginInitContract_t).
    ethPluginInitContract_t *msg = (ethPluginInitContract_t *) parameters;

    // Make sure we are running a compatible version.
    if (msg->interfaceVersion != ETH_PLUGIN_INTERFACE_VERSION_LATEST) {
        // If not the case, return the `UNAVAILABLE` status.
        msg->result = ETH_PLUGIN_RESULT_UNAVAILABLE;
        return;
    }

    // Double check that the `context_t` struct is not bigger than the maximum size (defined by
    // `msg->pluginContextLength`).
    if (msg->pluginContextLength < sizeof(context_t)) {
        PRINTF("Plugin parameters structure is bigger than allowed size\n");
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        return;
    }

    context_t *context = (context_t *) msg->pluginContext;

    // Initialize the context (to 0).
    memset(context, 0, sizeof(*context));

    // Look for the index of the selectorIndex passed in by `msg`.
    uint8_t i;
    for (i = 0; i < NUM_SELECTORS; i++) {
        if (memcmp((uint8_t *) PIC(COMPOUND_SELECTORS[i]), msg->selector, SELECTOR_SIZE) == 0) {
            context->selectorIndex = i;
            break;
        }
    }

    // If `i == NUM_SELECTORS` it means we haven't found the selector. Return an error.
    if (i == NUM_SELECTORS) {
        msg->result = ETH_PLUGIN_RESULT_UNAVAILABLE;
    }

    // Set `next_param` to be the first field we expect to parse.

    switch (context->selectorIndex) {
        case COMPOUND_MINT:
            context->next_param = MINT_AMOUNT;
            break;
        case COMPOUND_REDEEM:
            context->next_param = REDEEM_TOKENS;
            break;
        case COMPOUND_REDEEM_UNDERLYING:
            context->next_param = REDEEM_AMOUNT;
            break;
        case COMPOUND_BORROW:
            context->next_param = BORROW_AMOUNT;
            break;
        case COMPOUND_REPAY_BORROW:
            context->next_param = REPAY_AMOUNT;
            break;
        case COMPOUND_REPAY_BORROW_ON_BEHALF:
            context->next_param = BORROWER;
            break;
        case COMPOUND_TRANSFER:
            context->next_param = RECIPIENT;
            break;
        case COMPOUND_LIQUIDATE_BORROW:
            context->next_param = BORROWER;
            break;
        case COMPOUND_MANUAL_VOTE:
            context->next_param = PROPOSAL_ID;
            break;
        case COMPOUND_VOTE_DELEGATE:
            context->next_param = DELEGATEE;
            break;
        default:
            PRINTF("Missing selectorIndex: %d\n", context->selectorIndex);
            msg->result = ETH_PLUGIN_RESULT_ERROR;
            return;
    }
    // Return valid status.
    msg->result = ETH_PLUGIN_RESULT_OK;
}
