
    function EtchNode( tag, asyncCallback ) {

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

        this.observeObjectOrArray(this);
        Array.observe( this.childNodes, this.handleChildNodes.bind( this ) );
    }



    EtchNode.prototype.observeObjectOrArray = function( obj ){
        if ( Array.isArray( obj ) ){
            Array.observe( obj, this.handleArray.bind( this ) );
        } else {
            if ( obj !== null && typeof obj === "object") {
                Object.observe( obj, this.handleObject.bind( this ) );
            }
        }
    };

    EtchNode.prototype.unobserveObjectOrArray = function( obj ){
        if ( Array.isArray( obj ) ){
            Array.unobserve( obj );
        } else {
            if ( obj !== null && typeof obj === "object") {
                Object.unobserve( obj  );
            }
        }
    };

    EtchNode.prototype.root = function(){
        return this.parent ? this.parent.root() : this;
    };


    EtchNode.prototype.handleArray = function( changes ) {
        changes.forEach(function (change) {
            this.asyncCallback( null, change );
        }, this);
    };

    EtchNode.prototype.handleObject = function( changes ){

        changes.forEach( function( change ) {

            if ( change.object["parent"]  && change.name === "parent" && !( change.object[ "parent" ] instanceof EtchNode ) ){
                change.object["parent"] = null;
                return;
            }

            if ( change.type === "add" ){
                this.observeObjectOrArray( change.object[ change.name ] );
            }

            this.asyncCallback( null,  change );

        }, this );
    };



    EtchNode.prototype.handleChildNodes = function( changes ) {

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
    };

    module.exports = EtchNode;