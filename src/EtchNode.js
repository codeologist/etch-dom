
    function EtchNode( tag, asyncCallback ) {


        function handleObject( changes ){

            changes.forEach( function( change ) {

                if ( change.object["parent"]  && change.name === "parent" && !( change.object[ "parent" ] instanceof EtchNode ) ){
                    change.object["parent"] = null;
                    return;
                }

                this.asyncCallback( null,  change );

            }, this );
        }

        function handleChildNodes( changes ) {

            changes.forEach(function (change) {

                if ( change.type === "splice") {

                    index = change.index;

                    if ( change.removed.length  && !(change.object[index] instanceof EtchNode)){
                        return;
                    }

                } else {
                    index = change.object.length - 1;
                }

                if ( !( change.object[index] instanceof EtchNode ) ){
                    change.object.splice( index, 1 );
                    this.asyncCallback( new Error( "cannot append invalid node" ), null  );
                    return;
                }

                this.asyncCallback( null, change );

            }, this);
        }

        Object.defineProperties( this, {
            asyncCallback:{
                value:asyncCallback
            },
            parent:{
                value:null,
                writable: true,
                enumerable: true
            },
            childNodes:{
               value:[],
                writeable: true,
                enumerable: true
            }
        });

        Object.observe( this, handleObject.bind( this ) );
        Array.observe( this.childNodes, handleChildNodes.bind( this ) );
    }

    EtchNode.prototype.__elementIndex__ = function( tag ){
        return typeof this.__elementIndex__[tag]
    };

    EtchNode.prototype.root = function(){
        return this.parent ? this.parent.root() : this;
    };

    EtchNode.prototype.defineElement = function( tag ){
        this.__elementIndex__[tag] = {
            "tagName": tag
        };
    };


    EtchNode.prototype.hasElementType = function( tag ){
        return typeof this.__elementIndex__[tag]
    };


    module.exports = EtchNode;