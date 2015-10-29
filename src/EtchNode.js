
    function EtchNode() {

        Object.defineProperties( this, {
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

    EtchNode.prototype.onPropertyAdded = function( prop, val ){
        this.observeObjectOrArray( val );
    };

    EtchNode.prototype.onPropertyChanged = function( prop, val, oldval ){

    };

    EtchNode.prototype.onPropertyRemoved = function( prop, val, oldval ){
        this.unobserveObjectOrArray( val );
    };

    EtchNode.prototype.onItemsAdded = function( prop, arr ){
        console.log("ADD node")
    };

    EtchNode.prototype.onItemsChanged = function( prop, arr, old ){
        console.log("CHANGE node")
    };

    EtchNode.prototype.onItemsRemoved = function( prop, arr, old ){

    };

    EtchNode.prototype.onItemsSpliced = function( prop, arr, old, index, addedCount, removed){
        console.log("ADD spliced");
    };

    EtchNode.prototype.handleArray = function( changes ) {
        var name, arr, type, val;
        changes.forEach(function (change) {
            type = change.type;
            name = change.name;
            arr = change.object;

            if (type === "add") {
                this.onItemsAdded( name, arr );
            }
            if (type === "update") {
                this.onItemsChanged( name, arr, change.oldValue );
            }
            if (type === "delete") {
                this.onItemsRemoved( name, arr, change.oldValue );
            }
            if (type === "splice") {
                this.onItemsSpliced( name, arr, null, change.index, change.addedCount, change.removed );
            }

        }, this);
    };

    EtchNode.prototype.handleObject = function( changes ){
        var name, val,  act, valid;

        changes.forEach( function( change ) {

            act = change.type;
            name = change.name;
            val = change.object[ name ];
            valid = true;

            if ( val !== null && name === "parent" && !(val instanceof EtchNode) ){
                change.object["parent"] = null;
                return;
            }

            if ( act === "add"){
                this.onPropertyAdded( name, val );
            }
            if ( act === "update"){
                this.onPropertyChanged( name, val, change.oldValue );
            }
            if ( act === "delete"){
                this.onPropertyRemoved( name, val, change.oldValue );
            }

        }, this );
    };



    EtchNode.prototype.handleChildNodes = function( changes ) {
        var name, arr, type, val;
        changes.forEach(function (change) {
            type = change.type;
            arr = change.object;

            if (type === "add") {
                if ( !(arr[arr.length-1] instanceof EtchNode) ) {
                    arr.splice( arr.length-1, 1);
                    return;
                }
                this.onItemsAdded( name, arr );
            }
            if (type === "update") {
                if ( !(arr[arr.length-1] instanceof EtchNode) ) {
                    arr.splice( arr.length-1, 1);
                    return;
                }
                this.onItemsChanged( name, arr, change.oldValue );
            }
            if (type === "delete") {
                this.onItemsRemoved( name, arr, change.oldValue );
            }
            if (type === "splice") {
                if ( change.addedCount   && !(arr[change.index] instanceof EtchNode) ) {
                    console.log("removing non etch node");
                    arr.splice( change.index, 1);
                    return;
                }

                if ( change.removed.length  && !(arr[0] instanceof EtchNode)){
                    console.log("non etch node removed");
                    return;
                }
                this.onItemsSpliced( name, arr, null, change.index, change.addedCount, change.removed );
            }

        }, this);
    };
    module.exports = EtchNode;