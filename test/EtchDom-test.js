
    "use strict";

    var assert = require('assert');

    var EtchElement = require("../src/EtchElement");



    describe('EtchElement', function() {

        it('should create a document', function (done) {

            var element = new EtchElement();

            var document = element.createDocument() ;

            assert.equal( document.tagName, "DOCUMENT" );
            assert.equal( document.parent, null, "parent should be null because node is not yet included in a dom tree");
            assert.deepEqual( document.childNodes, [], "childNodes is an array");

            done();
        });
    });

    describe('Custom Elements', function() {

        it('should define a custom element', function (done) {
            var count = 0;

            function  AAA(){

                this.eventListenOnce( "onInit", function(){
                    count++;
                });
            }


            EtchElement.defineElement("custom", AAA );

            var customElement = new EtchElement().createElement("custom") ;

            setTimeout( function(){
                assert.equal( count, 1 );
                done();
            }, 0 );

        });
    });

    describe('Document', function() {

        it('should create an element', function (done) {

            var document = new EtchElement().createDocument();
            var element = document.createElement("div");

            assert.equal( element.tagName, "DIV" );
            assert.equal( element.parent, null );
            assert.deepEqual( element.childNodes, [] );

            done();
        });

        it('should disallow appending of non EtchNode objects', function (done) {

            var document = new EtchElement().createDocument();

            document.appendChild({});

            assert.equal( document.childNodes.length, 0 );

            done();
        });

        it('should allow appending of EtchNode objects', function (done) {

            var document = new EtchElement().createDocument();

            document.appendChild( document.createElement("div") );

            assert.equal( document.childNodes.length, 1 );

            done();
        });

        it('should be notified when a child is appended via public event bus', function (done) {

            var document = new EtchElement().createDocument();

            var childElement = document.createElement("div");

            document.addEventListener( "onAppendChild", function( e ){
                assert(e.currentTarget === childElement);
                done();
            });

            document.appendChild( childElement );
        });
    });

//
//    describe('EtchDomNode Basic Functionality Tests', function(){
//
//        it('should instantiable and have 2 default properties, parent and childNodes', function(done){
//
//            var node = new EtchDomNode();
//
//            assert.equal( node.parent, null, "parent should be null because node is not yet included in a dom tree" );
//            assert.deepEqual( node.childNodes,[],"childNodes is an array" );
//
//            done();
//        });
//
//        it('should add a parent EtchDomNode', function(done){
//
//            var node = new EtchDomNode( null, function( type ){
//                if ( type !== "init"){
//                    assert( this.parent instanceof EtchDomNode );
//                    done();
//                }
//
//            });
//
//            node.parent=new EtchDomNode();
//        });
//
//        it('should add a child EtchDomNode', function(done){
//
//            var node = new EtchDomNode( null, function( type ){
//                if ( type !== "init"){
//                    assert.equal( this.childNodes.length, 1 );
//                    done();
//                }
//            });
//
//            node.childNodes.push(new EtchDomNode());
//        });
//
//
//
//        it('should reject non EtchDomNode objects as a parent', function(done){
//
//            var node = new EtchDomNode( null, function(type){
//                if ( type !== "init") {
//                    assert.equal(this.parent, null);
//                    done();
//                }
//            });
//
//            node.parent={};
//        });
//
//
//        it('should reject non EtchDomNode objects as childnodes', function(done){
//
//            var node = new EtchDomNode( null, function(type){
//                if ( type !== "init") {
//                    assert.equal(this.childNodes.length, 0);
//                    done();
//                }
//            });
//            node.childNodes.push({});
//
//        });
//
//
//
//        it('should append child nodes', function(done){
//
//            var node = new EtchDomNode( null, function(type){
//                if ( type !== "init") {
//                    assert.equal(this.childNodes.length, 0);
//                    done();
//                }
//            });
//            node.childNodes.push({});
//
//        });
//
//
//    });
//
//
//
//    describe('EtchDomNode.defineElement', function() {
//
//        var node = new EtchDomNode();
//
//        it('should register a new element in the index containing a reference to the custom element by name', function (done) {
//
//            node.defineElement("custom", {
//
//                init:function(){
//
//                }
//            });
//
//            assert( node.hasElementType("custom") );
//
//            done();
//        });
//
//        it('should create a new element by tag name', function (done) {
//
//            var el =  node.createElement("custom");
//
//            assert( el.tagName === "CUSTOM" );
//
//            done();
//        });
//
//
//    });
//
//    describe('EtchDomNode Element Lifecycle', function() {
//
//        it('should trigger init event on element created', function (done) {
//
//            var node = new EtchDomNode();
//
//            node.defineElement("img", {
//                init:function(){
//                    done();
//                }
//            });
//
//            node.createElement("img" );
//
//        });
//
//        it('should trigger update event on element', function (done) {
//
//            var node = new EtchDomNode();
//
//            node.defineElement("img", {
//                update:function( type, prop, val ){
//console.log("=============",arguments)
//                    assert( type === "ADD");
//                    assert( prop === "src");
//                    assert( val === "12345");
//
//                    done();
//                }
//            });
//
//            node.createElement("img" );
//            node.src="12345";
//
//        });
//
//    });