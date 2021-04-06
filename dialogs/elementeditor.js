CKEDITOR.dialog.add('elementeditorDialog', function(editor){
	var size = CKEDITOR.document.getWindow().getViewPaneSize(),
		width = Math.min(size.width - 70, 800),
		height = size.height / 4;

	return {
		title: '',
		minWidth: 450,
		minHeight: 100,
		contents: [
			{
				id: 'elementSource',
				elements: [{
					type: 'textarea',
					id: 'html',
					inputStyle: 'width:' + width + 'px;height:' + height + 'px;',
					class: 'cke_source',
					setup: function(realElement){
						if (this.isOnCurrentPage())
							this.setValue(realElement.getOuterHtml());
					},
					commit: function(element){
						if (this.isOnCurrentPage() && this.getValue())
							newElement(this.getValue());
					}
				}]
			},
			{
				id: 'elementAttributes',
				hidden: true,
				elements: [{
					type: 'fieldset',
					label: ' ',
					children: [
						{
							id : 'attributes',
							type: 'html',
							html: '<div></div>',
							setup: function(realElement){
								if (this.isOnCurrentPage()){
									this.getElement().getParent().findOne('legend').setText(realElement.getName());
									CKEDITOR.tools.object.entries(realElement.getAttributes()).forEach(function(attr){
										newDialogElement(attr[0], attr[1]);
									});
								}
							},
							commit: function(element, realElement){
								if (this.isOnCurrentPage()){
									realElement.removeAttributes();
									this.getElement().find('input:nth-child(odd)').toArray().forEach(function(input){
										input.getValue() && realElement.setAttribute(input.getValue(), input.getNext().getValue());
									});
									newElement(realElement.getOuterHtml());
								}
							}
						},
						{
							type: 'button',
							label: '+',
							style: 'width:100%;margin-top:0.5em;',
							onClick: function(){
								newDialogElement();
							}
						}
					]
				}]
			}
		],
		onShow: function(){
			this.element = editor.getSelection().getStartElement();
			this.realElement = newElementFrom(this.element.getOuterHtml(), 'DataFormat');
			this.setupContent(this.realElement);
		},
		onOk: function(){
			this.commitContent(this.element, this.realElement);
		},
		onHide: function(){
			this.getContentElement('elementAttributes', 'attributes').getElement().setHtml('');
		}
	};


	function newElementFrom(html, to){
		return CKEDITOR.dom.element.createFromHtml(editor.dataProcessor['to'+to](html, {context: 'p'}));
	}

	function newElement(html){
		newElementFrom(html, 'Html').replace(CKEDITOR.dialog.getCurrent().element);
	}

	function newDialogElement(attrName, attrValue){
		var input = function(w, v){ return '<input style="width:'+w+'%" class="cke_dialog_ui_input_text" value="'+(v || '')+'">' };
		CKEDITOR.dialog.getCurrent().getContentElement('elementAttributes', 'attributes').getElement().append(
			CKEDITOR.dom.element.createFromHtml(
				'<div role="presentation" class="cke_dialog_ui_text">'
				+ input(20, attrName)
				+ input(80, attrValue)
				+'</div>'
			)
		);
	}
});

