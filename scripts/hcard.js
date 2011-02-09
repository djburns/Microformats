
//check for 'hcard'
var vcards = document.getElementsByClassName('vcard');

if (vcards !== undefined){
	console.debug(vcards.length + ' vcards found');
	var x = vcards.length;
	while (x--){
		parse_vcard(vcards[x]);
	}
	vcards = null;
}else{
	console.debug('No vcards found');
}

function parse_vcard(context){
	var vcard = Object();
	vcard.n = Object(); //required by spec

	//check if the main hcard for the page
	if (context.tagName == 'ADDRESS'){
		vcard.author = true;
		console.debug('page authors hcard');
	}

	//check if a valid hcard i.e. has 'n' or implied 'n'
	//if org = fn then treat as org and allow empty 'n'
	var _n = context.getElementsByClassName('n');
	var _fn = context.getElementsByClassName('fn');
	var _org = context.getElementsByClassName('org');
	_n = _n[0];
	_fn = _fn[0];
	_org = _org[0];

	//check if an organization
	if ((_fn !== undefined) && (_org !== undefined)){
		if (_fn.getMicroformat() == _org.getMicroformat()){
			vcard.isOrg = true;
			vcard.fn = _fn.getMicroformat();
			vcard.n = '';
			_org = null;
		}
	}

	if ((_n !== undefined) && (!vcard.isOrg)){
		if (_fn !== undefined){
			vcard.fn = _fn.getMicroformat();
		}
		
		//comprehensive 'n' search
		//TODO: investigate if n subproperties can be plural
		var _family_name = _n.getElementsByClassName('family-name');
		var _given_name = _n.getElementsByClassName('given-name');
		var _additional_name = _n.getElementsByClassName('additional-name');
		var _honorific_prefix = _n.getElementsByClassName('honorific-prefix');
		var _honorific_suffix = _n.getElementsByClassName('honorific-suffix');

		if (_family_name[0] !== undefined)
			vcard.n.family_name = _family_name[0].getMicroformat();
		if (_given_name[0] !== undefined)
			vcard.n.given_name = _given_name[0].getMicroformat();
		if (_additional_name[0] !== undefined)
			vcard.n.additional_name = _additional_name[0].getMicroformat();
		if (_honorific_prefix[0] !== undefined)
			vcard.n.honorific_prefix = _honorific_prefix[0].getMicroformat();
		if (_honorific_suffix[0] !== undefined)
			vcard.n.honorific_suffix = _honorific_suffix[0].getMicroformat();
			
		//huge variable clearing to save memory
		_n = _family_name = _given_name = _additional_name = 
		_honorific_prefix = _honorific_suffix = null;
	}else{
		if ((_fn !== undefined) && (!vcard.isOrg)){
			vcard.fn = _fn.getMicroformat();
			//first last
			var combo1 = vcard.fn.match(/^(\S+)\ (\S+)$/); 
			//last, first
			var combo2 = vcard.fn.match(/^(\S+),\ (\S+)$/);
			//nickname
			var combo3 = vcard.fn.match(/^\S+$/);
			
			if (combo1 != null){
				vcard.n.given_name = combo1[1];
				vcard.n.family_name = combo1[2];
			}else{ if (combo2 != null){;
				vcard.n.given_name = combo1[2];
				vcard.n.family_name = combo1[1];
			}else{ if (combo3 != null){
				vcard.n = '';
				vcard.nickname = combo3[0]; 
			}}}
		}else{
		}
	}
	_n = _fn = _org = null;
	
	
	//detect address
	var _adr = context.getElementsByClassName('adr');
	var i = _adr.length || '0';

	vcard.adr = [];
	while (i--){
		vcard.adr[i] = new Object();
		var _type = _adr[i].getElementsByClassName('type');
		var _post_office_box = _adr[i].getElementsByClassName('post-office-box');
		var _extended_address = _adr[i].getElementsByClassName('extended-address');
		var _street_address = _adr[i].getElementsByClassName('street-address');
		var _locality = _adr[i].getElementsByClassName('locality');
		var _region = _adr[i].getElementsByClassName('region');
		var _postal_code = _adr[i].getElementsByClassName('postal-code');
		var _country_name = _adr[i].getElementsByClassName('country-name');
		
		if (_type[0] !== undefined)
			vcard.adr[i].type = _type[0].getMicroformat();
		if (_post_office_box[0] !== undefined)
			vcard.adr[i].post_office_box = _post_office_box[0].getMicroformat();
		if (_extended_address[0] !== undefined)
			vcard.adr[i].extended_address = _extended_address[0].getMicroformat();
		if (_street_address[0] !== undefined)
			vcard.adr[i].street_address = _street_address[0].getMicroformat();
		if (_locality[0] !== undefined)
			vcard.adr[i].locality = _locality[0].getMicroformat();
		if (_region[0] !== undefined)
			vcard.adr[i].region = _region[0].getMicroformat();
		if (_postal_code[0] !== undefined)
			vcard.adr[i].postal_code = _postal_code[0].getMicroformat();
		if (_country_name[0] !== undefined)
			vcard.adr[i].country_name = _country_name[0].getMicroformat();
			
		_post_office_box =  _extended_address = _street_address =
		_locality = _region = _postal_code = _country_name = null;
	}
	
	if (vcard.adr.length == 1){
		vcard.adr = vcard.adr[0];
	}
	if (vcard.adr.length == 0){
		vcard.adr = '';
	}
	_adr = null;
	
	//detect birthday
	var _bday = context.getElementsByClassName('bday');
	if (_bday[0] !== undefined)
		vcard.bday = _bday[0].getMicroformat();
	_bday = null;
	
	//detect category
	var _category = context.getElementsByClassName('category');
	if (_category[0] !== undefined)
		vcard.category = _category[0].getMicroformat();
	_category = null;

	//detect email
	var _email = context.getElementsByClassName('email');
	var i = _email.length || '0';
	vcard.email = [];
	while (i--){
		var _type = _email[i].getElementsByClassName('type');
		if (_type[0] !== undefined){
			vcard.email[i] = new Object();
			vcard.email[i].type = _type[0].getMicroformat();
			vcard.email[i].value = _email[i].getMicroformat();
			_type = null;
		}else{
			vcard.email[i] = _email[i].getMicroformat();
		}
	}
	if (vcard.email.length == 1){
		vcard.email = vcard.email[0];
	}
	if (vcard.email.length == 0){
		vcard.email = '';
	}
	_email = null;

	//detect geo
	var _geo = context.getElementsByClassName('geo');
	if (_geo[0] !== undefined){
		if (_geo[0].hasChildNodes){
			vcard.geo = new Object();
			var _lat = _geo[0].getElementsByClassName('latitude');
			var _lon = _geo[0].getElementsByClassName('longitude');
			var _match = false;
			if (_lat[0] !== undefined){
				vcard.geo.latitude = _lat[0].getMicroformat();
				_match = true;
			}
			if (_lon[0] !== undefined){
				vcard.geo.longitude = _lon[0].getMicroformat();
				_match = true;
			}
			if (!_match){
				vcard.geo = _geo[0].getMicroformat();
			}
			_match = _lat = _lon = null;
		}else{
			vcard.geo = _geo[0].getMicroformat();
		}
	}
	_geo = null;
	
	//detect title
	var _title = context.getElementsByClassName('title');
	var i = _title.length || '0';
	vcard.title = [];
	while (i--){
		vcard.title[i] = _title[i].getMicroformat();
	}
	if (vcard.title.length == 1){
		vcard.title = vcard.title[0];
	}
	if (vcard.title.length == 0){
		vcard.title = '';
	}
	_title = null;
	
	//detect title
	var _org = context.getElementsByClassName('org');
	var i = _org.length || '0';
	vcard.org = [];
	while (i--){
		if (_org[i].hasChildNodes){
			vcard.org[i] = new Object();
			var _organization_name = _org[i].getElementsByClassName('organization-name');
			var _organization_unit = _org[i].getElementsByClassName('organization-unit');
			var _match = false;
			if (_organization_name[i] !== undefined){
				vcard.org[i].organization_name = _organization_name[0].getMicroformat();
				_match = true;
			}
			if (_organization_unit[i] !== undefined){
				vcard.org[i].organization_unit = _organization_unit[0].getMicroformat();
				_match = true;
			}
			if (!_match){
				vcard.org[i] = _org[i].getMicroformat();
			}
			_match = _organization_unit = _organization_name = null;
		}else{
			vcard.org[i] = _org[i].getMicroformat();
		}
	}
	if (vcard.org.length == 1){
		vcard.org = vcard.org[0];
	}
	if (vcard.org.length == 0){
		vcard.org = '';
	}
	_org = null;
	
	//detect tel
	var _tel = context.getElementsByClassName('tel');
	var i = _tel.length || '0';
	vcard.tel = [];
	while (i--){
		var _type = _tel[i].getElementsByClassName('type');
		if (_type[0] !== undefined){
			vcard.tel[i] = new Object();
			vcard.tel[i].type = _type[0].getMicroformat();
			vcard.tel[i].value = _tel[i].getMicroformat();
			_type = null;
		}else{
			vcard.tel[i] = _tel[i].getMicroformat();
		}
	}
	if (vcard.tel.length == 1){
		vcard.tel = vcard.email[0];
	}
	if (vcard.tel.length == 0){
		vcard.tel = '';
	}
	_tel = null;
	
	console.debug(vcard);
}

//get a list of all hcards
//loop through and call parser


//---parser
//check for fn | n
