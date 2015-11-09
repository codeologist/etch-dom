
    function EtchNode( tag, xxx ) {

        var init = function(){};
        var update = function(){console.log("x---x--------xxxxxxxx---------xxxxx")};
        var destroy = function(){};

        if ( typeof xxx === "function"){
            init = xxx;
            update = xxx;
            destroy = xxx;
        }

        if ( typeof xxx === "object"){

            if ( typeof xxx.init === "function"){
                init = xxx.init;
            }

            if ( typeof xxx.update === "function") {
                update = xxx.update;
            }

            if ( typeof xxx.destroy === "function"){
                destroy = xxx.destroy;
            }
        }

        function handleObject( update, changes ){

            changes.forEach( function( change ) {

                if ( change.object["parent"]  && change.name === "parent" && !( change.object[ "parent" ] instanceof EtchNode ) ){
                    change.object["parent"] = null;
                    return;
                }
console.log( "--------->",  change.type, change.name, change.object[change.name], update)
                update.call( this, change.type, change.name, change.object[change.name] );

            }, this );
        }

        function handleChildNodes( tag, xxx, changes ) {

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
                    xxx.call( this, new Error( "cannot append invalid node" ), null  );
                    return;
                }

                xxx.call( this, null, change );

            }, this);
        }

        if ( typeof tag === "string" ){
            Object.defineProperty( this, "tagName",{
                value:tag.toUpperCase()
            });
        }
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

        Object.observe( this, handleObject.bind( this, update ) );
        Array.observe( this.childNodes, handleChildNodes.bind( this,tag, xxx ) );

        init.call( this, "init" );
    }

    EtchNode.prototype.__elementIndex__ = function( tag ){
        return typeof this.__elementIndex__[tag]
    };

    EtchNode.prototype.root = function(){
        return this.parent ? this.parent.root() : this;
    };

    EtchNode.prototype.createElement = function( tag ){

        var lifecycle = function(){};

        if ( typeof tag === "string"){
            tag = tag.toUpperCase();
        }

        if ( this.hasElementType( tag ) ){
            lifecycle = this.__elementIndex__[tag].lifecycle;
        }

        return new EtchNode( tag, lifecycle );
    };

    EtchNode.prototype.defineElement = function( tag, lifecycle ){
        tag = tag.toUpperCase();
        this.__elementIndex__[tag] = {
            "tagName": tag,
            "lifecycle": lifecycle || {}
        };
    };


    EtchNode.prototype.hasElementType = function( tag ){
        tag = tag.toUpperCase();
        return typeof this.__elementIndex__[tag];
    };


    module.exports = EtchNode;