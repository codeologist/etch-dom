

    "use strict";

    var EtchNode = require("etch-node");

    function EtchElement( tag, nodeType ){

        Object.defineProperty( this, "tagName",{
            enumerable:true,
            value: tag
        });

        this.parent = null;
        this.childNodes = [];
        this.nodeType = nodeType;
    }
    EtchElement.prototype.validNodes = new Set([1, 3, 9]);

    EtchElement.prototype.createDocument = function(){
        var Document = EtchNode.extend( EtchElement );
        return new Document("DOCUMENT", 9 );
    };

    EtchElement.prototype.createElement = function( tag ){

        var Element;

        if ( this.definedElements[tag] ){
            Element = EtchNode.extend( EtchElement,this.definedElements[tag] );
        } else {
            Element = EtchNode.extend( EtchElement );
        }

        var el = new Element( tag.toUpperCase(), 1 );
        var e =  this.createEventObject();
        e.currentTarget = el;
        el.triggerEvent("onInit", e );
        return el;
    };

    EtchElement.prototype.addEventListener = function( type, callback, capture ){
        this.___addEventListener___( Infinity, type, callback, capture );
    };

    EtchElement.prototype.eventListenOnce = function( type, callback, capture ){
        this.___addEventListener___( 1, type, callback, capture );
    };

    EtchElement.prototype.appendChild = function( node ) {

        if ( !this.validNodes.has(node.nodeType) ){
            return;
        }

        this.childNodes.push( node );

        var event = this.createEventObject();
        event.currentTarget = node;
        this.triggerEvent( "onAppendChild", event );
    };


    EtchElement.prototype.definedElements = {};

    var ExtendedEtchElement = EtchNode.extend( EtchElement );

    Object.defineProperty( ExtendedEtchElement, "defineElement", {
        value:function( customElementName, constructor ){
            ExtendedEtchElement.prototype.definedElements[ customElementName ] = constructor;
        }
    });

    module.exports = ExtendedEtchElement;


//    function EtchDomNode( tag, xxx ) {
//
//        var init = function(){};
//        var update = function(){};
//        var destroy = function(){};
//
//        if ( typeof xxx === "function"){
//            init = xxx;
//            update = xxx;
//            destroy = xxx;
//        }
//
//        if ( typeof xxx === "object"){
//
//            if ( typeof xxx.init === "function"){
//                init = xxx.init;
//            }
//
//            if ( typeof xxx.update === "function") {
//                update = xxx.update;
//            }
//
//            if ( typeof xxx.destroy === "function"){
//                destroy = xxx.destroy;
//            }
//        }
//
//        function handleObject( update, changes ){
//
//            changes.forEach( function( change ) {
//
//                if ( change.object["parent"]  && change.name === "parent" && !( change.object[ "parent" ] instanceof EtchDomNode ) ){
//                    change.object["parent"] = null;
//                    return;
//                }
//console.log( "--------->",  change.type, change.name, change.object[change.name], update)
//                update.call( this, change.type, change.name, change.object[change.name] );
//
//            }, this );
//        }
//
//        function handleChildNodes( tag, xxx, changes ) {
//
//            changes.forEach(function (change) {
//
//                if ( change.type === "splice") {
//
//                    index = change.index;
//
//                    if ( change.removed.length  && !(change.object[index] instanceof EtchDomNode)){
//                        return;
//                    }
//
//                } else {
//                    index = change.object.length - 1;
//                }
//
//                if ( !( change.object[index] instanceof EtchDomNode ) ){
//                    change.object.splice( index, 1 );
//                    xxx.call( this, new Error( "cannot append invalid node" ), null  );
//                    return;
//                }
//
//                xxx.call( this, null, change );
//
//            }, this);
//        }
//
//        if ( typeof tag === "string" ){
//            Object.defineProperty( this, "tagName",{
//                value:tag.toUpperCase()
//            });
//        }
//        Object.defineProperties( this, {
//            parent:{
//                value:null,
//                writable: true,
//                enumerable: true
//            },
//            childNodes:{
//               value:[],
//                writeable: true,
//                enumerable: true
//            }
//        });
//
//        Object.observe( this, handleObject.bind( this, update ) );
//        Array.observe( this.childNodes, handleChildNodes.bind( this,tag, xxx ) );
//
//        init.call( this, "init" );
//    }
//
//    EtchDomNode.prototype.__EtchElementIndex__ = function( tag ){
//        return typeof this.__EtchElementIndex__[tag]
//    };
//
//    EtchDomNode.prototype.root = function(){
//        return this.parent ? this.parent.root() : this;
//    };
//
//    EtchDomNode.prototype.createEtchElement = function( tag ){
//
//        var lifecycle = function(){};
//
//        if ( typeof tag === "string"){
//            tag = tag.toUpperCase();
//        }
//
//        if ( this.hasEtchElementType( tag ) ){
//            lifecycle = this.__EtchElementIndex__[tag].lifecycle;
//        }
//
//        return new EtchDomNode( tag, lifecycle );
//    };
//
//    EtchDomNode.prototype.defineEtchElement = function( tag, lifecycle ){
//        tag = tag.toUpperCase();
//        this.__EtchElementIndex__[tag] = {
//            "tagName": tag,
//            "lifecycle": lifecycle || {}
//        };
//    };
//
//
//    EtchDomNode.prototype.hasEtchElementType = function( tag ){
//        tag = tag.toUpperCase();
//        return typeof this.__EtchElementIndex__[tag];
//    };
//
//
//    module.exports = EtchDomNode;