const fastify = require('fastify')({logger: true});

const graph = {
    a: {b: 2, c: 1},
    b: {f: 7},
    c: {d: 5, e: 2},
    d: {f: 2},
    e: {f: 1},
    f: {g: 1},
    g: {}
}


const shortPath = (graph, start, end) => {
    let costs = {
        value: {},
        path: []
    };

    const processed = []
    const path = {}
    let neighbors = {}

    let node;

    Object.keys(graph).forEach(key => {
        if (key === start) {
            costs.value[key] = 0;

        } else {
            costs.value[key] = Infinity;
        }

    })

    node = findLowestNode(costs.value, processed);

    while (node) {
        const cost = costs.value[node];
        neighbors = graph[node];

        for (let neighbor in neighbors) {
            let newCost = cost + neighbors[neighbor];


            if (newCost < costs.value[neighbor]) {
                path[node] = path[node] ? neighbor : neighbor;
                costs.value[neighbor] = newCost;
            }
        }

        processed.push(node);
        node = findLowestNode(costs.value, processed);
    }


    let newPath = [];
    Object.keys(path).forEach(key => {
        newPath.push(key);
        newPath.push(path[key]);
    })

    const filter = [];

    newPath = newPath.filter((item, index) => {

        if (filter.includes(item) || index === 0 || index === newPath.length - 1) {
            return true
        } else {
            filter.push(item)
            return false
        }
    })

    const setArray = new Set(newPath);
    newPath = [...setArray];

    return newPath
}

const findLowestNode = (costs, processed) => {
    let lowestCost = 100000000
    let lowestNode;
    Object.keys(costs).forEach(node => {
        let cost = costs[node]
        if (cost < lowestCost && !processed.includes(node)) {
            lowestCost = cost
            lowestNode = node
        }
    })
    return lowestNode
}

console.log(shortPath(graph, "a", "g"))

fastify.get('/', async (request, reply) => {

    return {hello: 'world'}
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(8000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start();