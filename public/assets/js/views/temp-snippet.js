define([
       "jquery", "underscore", "backbone",
       "views/snippet", "views/temp-snippet"
       "pubsub"
], function(){
  return SnippetView.extend({
    initialize: function(){
      pubsub.on("newTempPostRender", this.postRender, this);
      this.constructor.__super__.initialize.call(this);
    }
    , render: function() {
      return this.$el.html(tempTemplate({text: this.constructor.__super__.render.call(this).html()}));
    }
    , postRender: function(mouseEvent){
      this._$temp = $(this.$el.find("form")[0]);
      this._$temp.css("-webkit-transform", "rotate(-2deg)");
      this.centerOnEvent(mouseEvent);
    }
    , className: "temp"
    , events:{
      "mousemove": "mouseMoveHandler",
      "mouseup" : "mouseUpHandler",
    }
    , centerOnEvent: function(mouseEvent){
      var mouseX = mouseEvent.pageX;
      var mouseY = mouseEvent.pageY;
      var $tempForm = $(this.$el.find("form")[0]);
      var halfHeight = $tempForm.height()/2;
      var halfWidth  = $tempForm.width()/2;
      $tempForm.css({
        "top"       : (mouseY - halfHeight) + "px",
        "left"      : (mouseX - halfWidth) + "px"
      });
      // Make sure the element has been drawn and 
      // has height in the dom before triggering.
      if (this._$temp.height() > 0) { 
        pubsub.trigger("tempMove", mouseEvent, this._$temp.height());
      }
    }
    , mouseMoveHandler: function(mouseEvent) {
      this.centerOnEvent(mouseEvent);
    }
    , mouseUpHandler: function(mouseEvent){
      pubsub.trigger("tempDrop", mouseEvent, this.model);
      this.remove();
    }
  });
});
