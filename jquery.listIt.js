(function ($) {
  $.fn.listIt = function (cfg) {
    //defaults
    var settings = {
      items: false, //["you@me.com", "why@because.com"],
      itemTmpl: "",
      containerClass: "editList",
      delBtnClass: "btn small",
      showDelBtn: true,
      fadeTime: 250,
      addBtnId: "",
      addBtnClass: "btn small",
      addBtnText: "Add",
      showAddBtn: true,
      inputId: "",
      inputClass: "editList",
      inputName: "",
      showInput: true,
      onBeforeAdd: function (value) { },
      onAdd: function (value) { },
      onBeforeDel: function (value) { },
      onDel: function (value) { },
      tmpl: ""
    };

    //update defaults w/ any configs set by user
    if (cfg) {
      $.extend(settings, cfg);
    }

    //loop thru collection, initialize, set handlers, maintain chaining
    return this.each(function () {
      var $this = $(this),
          items = [],
          itemHTML = "",
          inputHTML = settings.showInput ?
                      '<input type="text" id="' + settings.inputId +
                      '"name="' + settings.inputName +
                      '" value="" class="' + settings.inputClass +
                      '" />' : "",
          addBtnHTML = settings.showAddBtn ?
                       '<span id="' + settings.addBtnId +
                       '" class="' + settings.addBtnClass +
                       '">' + settings.addBtnText +
                       '</span>' : "",
          delBtnHMTL = settings.showDelBtn ?
                       '<span class="' + settings.delBtnClass +
                       '">X</span>' : "";

      //internal methods
      function updateListItems() {
        var $inputEl = $this.next("input"),
            inputVal = $inputEl.val();

        //bail if input is empty
        if (!inputVal && settings.showInput) {
          return false;
        }

        //trigger onBeforeAdd callback
        if (settings.onBeforeAdd(inputVal) === false) {
          return false;
        }

        //icky! TODO: better approach to item templating?
        if (settings.itemTmpl) {
          itemHTML = '<li><span>' + settings.itemTmpl +
                     '</span>' + delBtnHMTL +
                     '</li>';
        } else {
          itemHTML = '<li><span>' + inputVal +
                     '</span>' + delBtnHMTL +
                     '</li>';
        }

        //insert list item
        $this.append(itemHTML);

        //trigger onAdd callback
        settings.onAdd(inputVal);

        //clear input
        $inputEl.val("");
      }

      function removeListItem() {
        var $this = $(this),
            itemVal = $this.prev().text(),
            $target = $this.parent();

        //trigger onBeforeDelete callback
        if (settings.onBeforeDel(itemVal) === false) {
          return false;
        }

        //remove item
        $target.fadeOut(settings.fadeTime, function(){
          $target.remove();
        });

        //trigger onDelete callback
        settings.onDel(itemVal);
      }

      //extract list items from html if they aren't being passed in
      if (settings.items) {
        items = settings.items;
      } else {
        items = $this.children().map(function () {
          return this.innerHTML;
        });
      }

      //build new list template
      for (var i = 0; i < items.length; i = i + 1) {
        itemHTML += "<li><span>" + items[i] +
                    '</span>' + delBtnHMTL +
                    '</li>';

      }

      //inject new template
      $this.html(itemHTML);

      //append input and add button
      inputHTML += addBtnHTML;
      $this.after(inputHTML);

      //attach add item handlers
      if (settings.showAddBtn) {
        //event handler for add btn
        $this.nextAll("span").first().bind("click", updateListItems);

        //enter key handler
        $this.next("input").bind("keydown", function (e) {
          if (e.which === 13) {
            updateListItems();
          }
        });
      } else {
        //event handlers for input
        $this.next("input").bind("change", updateListItems);
      }

      //add event handler for delete button
      if (settings.showDelBtn) {
        $this.delegate("span + span", "click", removeListItem);
      }
    });
  };
})(jQuery);
