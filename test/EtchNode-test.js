
    "use strict";

    var assert = require('assert');
    var EtchNode = require("../src/EtchNode");


    describe('EtchNode Basic Functionality Tests', function(){

        it('should instantiable and have 2 default properties, parent and childNodes', function(done){

            var node = new EtchNode();

            assert.equal( node.parent, null, "parent should be null because node is not yet included in a dom tree" );
            assert.deepEqual( node.childNodes,[],"childNodes is an array" );

            done();
        });

        it('should add a parent EtchNode', function(done){

            var node = new EtchNode( null, function( type ){
                if ( type !== "init"){
                    assert( this.parent instanceof EtchNode );
                    done();
                }

            });

            node.parent=new EtchNode();
        });

        it('should add a child EtchNode', function(done){

            var node = new EtchNode( null, function( type ){
                if ( type !== "init"){
                    assert.equal( this.childNodes.length, 1 );
                    done();
                }
            });

            node.childNodes.push(new EtchNode());
        });



        it('should reject non EtchNode objects as a parent', function(done){

            var node = new EtchNode( null, function(type){
                if ( type !== "init") {
                    assert.equal(this.parent, null);
                    done();
                }
            });

            node.parent={};
        });


        it('should reject non EtchNode objects as childnodes', function(done){

            var node = new EtchNode( null, function(type){
                if ( type !== "init") {
                    assert.equal(this.childNodes.length, 0);
                    done();
                }
            });
            node.childNodes.push({});

        });



        it('should append child nodes', function(done){

            var node = new EtchNode( null, function(type){
                if ( type !== "init") {
                    assert.equal(this.childNodes.length, 0);
                    done();
                }
            });
            node.childNodes.push({});

        });


    });



    describe('EtchNode.defineElement', function() {

        var node = new EtchNode();

        it('should register a new element in the index containing a reference to the custom element by name', function (done) {

            node.defineElement("custom", {

                init:function(){

                }
            });

            assert( node.hasElementType("custom") );

            done();
        });

        it('should create a new element by tag name', function (done) {

            var el =  node.createElement("custom");

            assert( el.tagName === "CUSTOM" );

            done();
        });


    });

    describe('EtchNode Element Lifecycle', function() {

        it('should trigger init event on element created', function (done) {

            var node = new EtchNode();

            node.defineElement("img", {
                init:function(){
                    done();
                }
            });

            node.createElement("img" );

        });

        it('should trigger update event on element', function (done) {

            var node = new EtchNode();

            node.defineElement("img", {
                update:function( type, prop, val ){
console.log("=============",arguments)
                    assert( type === "ADD");
                    assert( prop === "src");
                    assert( val === "12345");

                    done();
                }
            });

            node.createElement("img" );
            node.src="12345";

        });

    });