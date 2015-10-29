
    "use strict";

    var assert = require('assert');
    var EtchNode = require("../src/EtchNode");


    describe('Etch Node Functional', function(){

        it('should create a standard etch node', function(done){

            var node = new EtchNode();

            assert.equal( node.parent, null );
            assert.deepEqual( node.childNodes,[] );

            node.childNodes.push({});
            node.parent={};


            done();
        });

        it('should allow constucting a tree.', function(done){

            var node = new EtchNode();

            node.parent=new EtchNode();
            node.childNodes.push(new EtchNode());

            setTimeout( function(){
                assert( node.parent instanceof EtchNode );
                assert.equal( node.childNodes.length, 1 );

                done();

            }, 0 );

        });

        it('should not allow constucting a tree from non EtchNode objects', function(done){

            var node = new EtchNode();

            node.parent={};
            node.childNodes.push({});

            setTimeout( function(){
                assert.equal( node.parent, null );
                assert.equal( node.childNodes.length,0 );

                done();

            }, 0 );
        });

        it('should treat parent and childNodes property as special cases', function(done){

            var node = new EtchNode();

            node.prop={};
            node.arr = [];
            node.arr.push(1);

            setTimeout( function(){
                assert( typeof node.parent === "object" );
                assert.equal( node.arr[0], 1 );

                done();

            }, 0 );
        });

    });