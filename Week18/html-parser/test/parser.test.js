import assert from 'assert'
import { parseHTML } from '../src/parser.js'

describe('parse html:', function () {
    it('<a></a>', function () {
        const tree = parseHTML('<a></a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a>asd</a>', function () {
        const tree = parseHTML('<a>asd</a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 1);
    });
    it('<a href="//baidu.com">asd</a>', function () {
        const tree = parseHTML('<a href="//baidu.com">asd</a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 1);
    });
    it('<a id=qwe ></a>', function () {
        const tree = parseHTML('<a id=qwe ></a>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<input/>', function () {
        const tree = parseHTML('<input/>');
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it("<i href />", function () {
        const tree = parseHTML("<i href />");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it("<i href id />", function () {
        const tree = parseHTML("<i href id />");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it("<i id=aaa>", function () {
        const tree = parseHTML("<i id=aaa>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<>', function () {
        const tree = parseHTML('<>');
        assert.equal(tree.children.length, 0);
    });
    it('<a id=\'abc\'/>', () => {
        let tree = parseHTML('<a id=\'abc\'/>');
        assert.strictEqual(tree.children.length, 0);
    });
    it('<A/> aaaa', function () {
        let tree = parseHTML('<A/>');
        assert.strictEqual(tree.children.length, 1);
    });
    it('<a \n id="abc"/> case', () => {
        let tree = parseHTML('<a \n id="abc"/>');
        assert.strictEqual(tree.children.length, 1);
    });
    it('<a id="cici" \n></a>', function () {
        let tree = parseHTML('<a id="cici" \n></a>');
        assert.strictEqual(tree.children.length, 1);
    });
});