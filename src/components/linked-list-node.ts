interface ListNode<V> {
    value: V;
    next: ListNode<V> | null;
}

class LinkedListNode<V> {
    value: V;
    next: LinkedListNode<V> | null;

    constructor(value: V, next = null) {
        this.value = value;
        this.next = next;
    }
}

interface List<V> {
    append(value: V): List<V>;

    prepend(value: V): List<V>;
}

class LinkedList<V> implements List<V> {
    tail: ListNode<V> | null;
    head: ListNode<V> | null;

    constructor() {
        this.tail = null;
        this.head = null;
    }

    append(value: V) {
        const newListNode = new LinkedListNode(value);

        if (!this.head || !this.tail) {
            this.head = newListNode;
            this.tail = newListNode;

            return this;
        }

        this.tail.next = newListNode;
        this.tail = newListNode;

        return this;
    }

    prepend(value: V) {
        const newListNode = new LinkedListNode(value, this.head);

        this.head = newListNode;

        if (!this.tail) {
            this.tail = newListNode;
        }

        return this;
    }

    find(value) {
        if (!this.head) {
            return null;
        }

        let currentNode = this.head;

        while (currentNode) {
            if (currentNode === value) {
                return currentNode;
            }

            currentNode = currentNode.next;
        }

        return null;
    }

    delete(value) {
        if (!this.head) {
            return null;
        }

        let deletedNode = null;

        while (this.head && this.head.value === value) {
            deletedNode = this.head;

            this.head = this.head.next;
        }

        let currentNode = this.head;

        if (currentNode !== null) {
            while (currentNode.next) {
                if (currentNode.next.value === value) {
                    deletedNode = currentNode.next;
                    currentNode.next = currentNode.next.next;
                } else {
                    currentNode = currentNode.next;
                }
            }
        }

        if (this.tail?.value === value) {
            this.tail = currentNode;
        }

        return deletedNode;
    }

    values() {
        const values = [];

        let currentNode = this.head;

        while (currentNode) {
            values.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return values;
    }

    fromArray(values: V[]) {
        values.forEach((value) => this.append(value));

        return this;
    }

    toArray() {
        const nodes = [];

        let currentNode = this.head;

        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }

        return nodes;
    }

    toString() {
        return this.toArray().map((node) => node.value);
    }
}

export { LinkedList };
