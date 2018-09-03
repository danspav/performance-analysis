require(['jquery', 'underscore', 'splunkjs/mvc', 'util/console'], function($, _, mvc, console) {
     function setToken(name, value) {
         var defaultTokenModel = mvc.Components.get('default');
         if (defaultTokenModel) {
             defaultTokenModel.set(name, value);
         }
         var submittedTokenModel = mvc.Components.get('submitted');
         if (submittedTokenModel) {
             submittedTokenModel.set(name, value);
         }
     }
     $('.dashboard-body').on('click', '[data-on-class],[data-off-class],[data-set-token],[data-unset-token],[data-token-json]', function(e) {
         e.preventDefault();
		
         var target = $(e.currentTarget);
		 
		 var cssOnClass= target.data('on-class');
		 var cssOffClass = target.data('off-class');
		 if (cssOnclass) {
			$("." + cssOnClass).attr('class', cssOffClass);
			target.attr('class', cssOnClass);
		 }
         var setTokenName = target.data('set-token');
         if (setTokenName) {
             setToken(setTokenName, target.data('value'));
         }
         var unsetTokenName = target.data('unset-token');
         if (unsetTokenName) {
             setToken(unsetTokenName, undefined);
         }
         var tokenJson = target.data('token-json');
         if (tokenJson) {
             try {
                 if (_.isObject(tokenJson)) {
                     _(tokenJson).each(function(value, key) {
                         if (value == null) {
                             // Unset the token
                             setToken(key, undefined);
                         } else {
                             setToken(key, value);
                         }
                     });
                 }
             } catch (e) {
                 console.warn('Cannot parse token JSON: ', e);
             }
         }
     });
 });