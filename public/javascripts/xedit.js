/**
 * Description -
 *      On Document Load, the inline-editable fields are declared in this file.
 *  Address and Full name fields require definitions.
 *  They were created following this template: https://github.com/vitalets/x-editable/blob/master/src/inputs-ext/address/address.js
 * @type {string}
 */

//turn to inline mode
$.fn.editable.defaults.mode = 'inline';

$(document).ready(function() {
    "use strict";

    /**
     * Address Definition
     **/
    var Address = function (options) {
        this.init('address', options, Address.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Address, $.fn.editabletypes.abstractinput);

    $.extend(Address.prototype, {
        /**
         Renders input from tpl
         @method render()
         **/
        render: function() {
            this.$input = this.$tpl.find('input');
        },

        /**
         Default method to show value in element. Can be overwritten by display option.
         @method value2html(value, element)
         **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return;
            }
            var html = $('<div>').text(value.line_1).html() + '<br>' + $('<div>').text(value.line_2).html() + '<br>' + $('<div>').text(value.city).html() + ', ' + $('<div>').text(value.state).html() + ' ' +  $('<div>').text(value.zip).html();
            $(element).html(html);
        },

        /**
         Gets value from element's html
         @method html2value(html)
         **/
        /**
         *  Vallues are set in view.hbs rather than here
         * **/
        html2value: function(html) {
            return null;
        },

        /**
         Converts value to string.
         It is used in internal comparing (not for sending to server).
         @method value2str(value)
         **/
        value2str: function(value) {
            var str = '';
            if(value) {
                for(var k in value) {
                    str = str + k + ':' + value[k] + ';';
                }
            }
            return str;
        },

        /**
         Converts string to value. Used for reading value from 'data-value' attribute.
         @method str2value(str)
         **/
        str2value: function(str) {
            /*
             this is mainly for parsing value defined in data-value attribute.
             If you will always set value by javascript, no need to overwrite it
             */
            return str;
        },

        /**
         Sets value of input.
         @method value2input(value)
         @param {mixed} value
         **/
        value2input: function(value) {
            if(!value) {
                return;
            }
            this.$input.filter('[name="line_1"]').val(value.line_1);
            this.$input.filter('[name="line_2"]').val(value.line_2);
            this.$input.filter('[name="city"]').val(value.city);
            this.$input.filter('[name="state"]').val(value.state);
            this.$input.filter('[name="zip"]').val(value.zip);
        },

        /**
         Returns value of input.
         @method input2value()
         **/
        input2value: function() {
            return {
                line_1: this.$input.filter('[name="line_1"]').val(),
                line_2: this.$input.filter('[name="line_2"]').val(),
                city: this.$input.filter('[name="city"]').val(),
                state: this.$input.filter('[name="state"]').val(),
                zip: this.$input.filter('[name="zip"]').val()
            };
        },

        /**
         Activates input: sets focus on the first field.
         @method activate()
         **/
        activate: function() {
            this.$input.filter('[name="line_1"]').focus();
        },

        /**
         Attaches handler to submit form in case of 'showbuttons=false' mode
         @method autosubmit()
         **/
        autosubmit: function() {
            this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
        }
    });

    Address.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl:
        '<div class="editable-address"><label><span>Line 1: </span><input type="text" name="line_1" class="input-small"></label></div>'+
        '<div class="editable-address"><label><span>Line 2: </span><input type="text" name="line_2" class="input-small"></label></div>'+
        '<div class="editable-address"><label><span>City: </span><input type="text" name="city" class="input-small"></label></div>'+
        '<div class="editable-address"><label><span>State: </span><input type="text" name="state" class="input-mini"></label></div>'+
        '<div class="editable-address"><label><span>Zip: </span><input type="text" name="zip" class="input-mini"></label></div>',

        inputclass: ''
    });

    $.fn.editabletypes.address = Address;

    /**
     * END OF ADDRESS IMPLEMENTATION
     */

    /**
     * NAMES IMPLEMENTATION
     */
    var Name = function (options) {
        this.init('name', options, Name.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Name, $.fn.editabletypes.abstractinput);

    $.extend(Name.prototype, {
        /**
         Renders input from tpl
         @method render()
         **/
        render: function() {
            this.$input = this.$tpl.find('input');
        },

        /**
         Default method to show value in element. Can be overwritten by display option.
         @method value2html(value, element)
         **/
        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return;
            }
            var html = $('<div>').text(value.first).html() + ' ' + $('<div>').text(value.middle).html() + ' ' + $('<div>').text(value.last).html();
            $(element).html(html);
        },

        /**
         Gets value from element's html
         @method html2value(html)
         **/
        /** KOHN TEAM - VALUES ARE DECLARED IN VIEW.HBS**/
        html2value: function(html) {
            return null;
        },

        /**
         Converts value to string.
         It is used in internal comparing (not for sending to server).
         @method value2str(value)
         **/
        value2str: function(value) {
            var str = '';
            if(value) {
                for(var k in value) {
                    str = str + k + ':' + value[k] + ';';
                }
            }
            return str;
        },

        /**
         Converts string to value. Used for reading value from 'data-value' attribute.
         @method str2value(str)
         **/
        str2value: function(str) {
            /*
             this is mainly for parsing value defined in data-value attribute.
             If you will always set value by javascript, no need to overwrite it
             */
            return str;
        },

        /**
         Sets value of input.
         @method value2input(value)
         @param {mixed} value
         **/
        value2input: function(value) {
            if(!value) {
                return;
            }
            this.$input.filter('[name="first"]').val(value.first);
            this.$input.filter('[name="middle"]').val(value.middle);
            this.$input.filter('[name="last"]').val(value.last);
        },

        /**
         Returns value of input.
         @method input2value()
         **/
        input2value: function() {
            return {
                first: this.$input.filter('[name="first"]').val(),
                middle: this.$input.filter('[name="middle"]').val(),
                last: this.$input.filter('[name="last"]').val()
            };
        },

        /**
         Activates input: sets focus on the first field.
         @method activate()
         **/
        activate: function() {
            this.$input.filter('[name="first"]').focus();
        },

        /**
         Attaches handler to submit form in case of 'showbuttons=false' mode
         @method autosubmit()
         **/
        autosubmit: function() {
            this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
        }
    });

    Name.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl:
        '<div class="editable-name"><label><span>First: </span><input type="text" name="first" class="input-small"></label></div>'+
        '<div class="editable-name"><label><span>Middle: </span><input type="text" name="middle" class="input-small"></label></div>'+
        '<div class="editable-name"><label><span>Last: </span><input type="text" name="last" class="input-small"></label></div>',

        inputclass: ''
    });

    $.fn.editabletypes.name = Name;
    /**
     * END NAMES IMPLEMENTATION
     */

    /**
     * SET ALL OTHER ELEMENTS TO EDITABLE
     * TODO: Organize these by how they appear in veiw.hbs
     **/
    $('#phone_number').editable();

    $('#cell_phone').editable();

    $('#pref_name').editable();

    $('#marital_status').editable();
    $('#spouse').editable();

    $('#email').editable();

    $('#special_circumstances').editable();

    $('#driver_license').editable();
    $('#emergency_name').editable({});
    $('#emergency_relation').editable({});

    $('#emergency_phone').editable({});
    $('#home_type').editable();
    $('#ownership_length').editable();
    $('#year_constructed').editable();
    $('#requested_repairs').editable();

    $('#f_client_contrib').editable();
    $('#f_associate_contrib').editable();

    $('#l_client_contrib').editable();
    $('#l_associate_contrib').editable();
    $('#fbo_name').editable();

    $('#mortgage_payment').editable({
            step: '0.01'
        }
    );

    $('#income').editable({
            step: '0.01'
        }
    );

    $('#dob').editable({
        format: 'yyyy-mm-dd',
        mode: 'popup'
    });

});