CKEDITOR.plugins.add('elementeditor', {
	lang: 'en,ru,uk',
	requires: 'dialog,menubutton,smethods',
	icons: 'elementeditor',

	init: function(editor){
		var lang = editor.lang.elementeditor,
			commandDefinition = {
				exec: function(editor){
					var name = 'element' + CKEDITOR.tools.capitalize(this.name.slice(11));
					editor.openDialog('elementeditorDialog', function(){
						this.parts.title.setText(lang[name]);
						this.selectPage(name);
					});
				}
			};

		CKEDITOR.dialog.add('elementeditorDialog', this.path + 'dialogs/elementeditor.js');

		editor.addCommands({
			editElementSource: commandDefinition,
			editElementAttributes: commandDefinition
		});

		editor.addMenuGroup('elementeditorGroup');

		editor.addMenuItems({
			editSourceItem: {
				label: lang.elementSource,
				group: 'elementeditorGroup',
				command: 'editElementSource',
			},
			editAttributesItem: {
				label: lang.elementAttributes,
				group: 'elementeditorGroup',
				command: 'editElementAttributes'
			}
		});

		editor.ui.addMenuButton('ElementEditor', {
			label: lang.title,
			onMenu: function(){
				return {
					editSourceItem: CKEDITOR.TRISTATE_OFF,
					editAttributesItem: CKEDITOR.TRISTATE_OFF
				}
			}
		});

		CKEDITOR.plugins.widget && editor.on('selectionChange', function(e){
			editor.ui.get('ElementEditor').setState(CKEDITOR.plugins.widget.isDomWidget(e.data.path.lastElement)
				? CKEDITOR.TRISTATE_DISABLED
				: CKEDITOR.TRISTATE_OFF
			);
		});
	}
});

