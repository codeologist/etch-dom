
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

        it('should add a parent', function(done){

            var node = new EtchNode( null, function(){
                assert( node.parent instanceof EtchNode );
                done();
            });

            node.parent=new EtchNode();
        });

        it('should add a child', function(done){

            var node = new EtchNode( null, function(){
                assert.equal( node.childNodes.length, 1 );
                done();
            });

            node.childNodes.push(new EtchNode());
        });



        it('should reject non EtchNode objects as a parent', function(done){

            var node = new EtchNode( null, function(){
                assert.equal( node.parent, null );
                done();
            });

            node.parent={};
        });



        it('should reject non EtchNode objects as childnodes', function(done){

            var node = new EtchNode( null, function(){
                assert.equal( node.childNodes.length,0 );
                done();
            });
            node.childNodes.push({});
        });

        it('should monitor plain arrays', function(done){

            var node = new EtchNode( null, function( err, change ){

                if ( change.type === "splice"){
                    assert.equal( node.arr[0], 1 );
                    done();
                }
            });

            node.prop={};
            node.arr = [];

            setTimeout( function(){
                node.arr.push(1);
            },0);


        });
    });