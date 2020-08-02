export const state = () => ({
    serverURL: 'http://localhost:8443',
    // serverURL: 'http://104.131.15.22:8080/backend-tracking4d',
    customer: {
    }
})

export const mutations = {
    setCustomer(state, customer) {
        state.customer = customer
    },
}