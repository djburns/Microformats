//make some useful functions for parsing
Element.__proto__.getMicroformat = function(){

	//***http://microformats.org/wiki/hcard-parsing#properties_of_type_URL_or_URI_or_UID
	if ((this.tagName == 'IMG') || (this.tagName == 'AREA')){
		if (this.hasAttribute('alt')){
			return this.getAttribute('alt');
		}else{
			return '';
		}
	}
	
	//***http://microformats.org/wiki/hcard-parsing#all_properties
	if (this.tagName == 'ABBR'){
		if (this.hasAttribute('title')){
			return this.getAttribute('title');
		}else{
			return this.textContent;
		}
	}
	
	//* not in the spec but if TIME tag then return datetime
	if (this.tagName == 'TIME'){
		if (this.hasAttribute('datetime')){
			return this.getAttribute('datetime');
		}
	}

	//*** http://microformats.org/wiki/value-class-pattern#Using_value-title_to_publish_machine-data
	if (this.hasChildNodes){
		if (this.childNodes[0].className != null){
			if (this.childNodes[0].classList.contains('value-title')){
				return this.childNodes[0].title || '';
			}
		}
	
	}

	//*** http://microformats.org/wiki/hcard-parsing#class_value_handling
	//get children
	if (this.hasChildNodes){
		var i = this.childNodes.length;
		var mf = '';

		while(i--){
			if (this.childNodes[i].className != null){
				if (this.childNodes[i].classList.contains('value')){
					if (!this.childNodes[i].title){
						mf = this.childNodes[i].textContent + mf;
					}else{
						mf = this.childNodes[i].title + mf;
					}
				}
			}
		}
		if (mf != '') return mf;
	}
	
	return this.textContent;
	
};

Element.__proto__.getMicroformatUri = function(){

	if ((this.tagName == 'A') || (this.tagName == 'AREA')){
		uri = this.href.match(/^(?:mailto|tel):([^\?]+)/);
		if (uri != null){
			return uri[1];
		}else{
			return this.href;
		}
	}
	
	if (this.tagName == 'IMG'){
		return this.src;
	}
	
	if (this.tagName == 'OBJECT'){
		return this.data;
	}
	
	return '';
	
}
