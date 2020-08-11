chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	document.getElementById('insert-url').value = tabs[0].url;
});

let deleteSubmit = document.getElementById('delete-submit');
deleteSubmit.onclick = function(element) {
	chrome.storage.sync.set({records: {}}, function() {});
}
let insertSubmit = document.getElementById('insert-submit');
insertSubmit.onclick = function(element) {
	let titleInput = document.getElementById('insert-title');
	let urlInput = document.getElementById('insert-url');
	let tagsInput = document.getElementById('insert-tags');
	let memoInput = document.getElementById('insert-memo');
	let tags = tagsInput.value.split(',').map(x => x.trim()).filter(x => x.length > 0);
	let record = {
		title: titleInput.value,
		url: urlInput.value,
		tags: tags,
		memo: memoInput.value
	};
	chrome.storage.sync.get('records', function(data) {
		let records = data.records;
		if(records == undefined){
			records = {};
		}
		records[record.title + record.url] = record;
		chrome.storage.sync.set({records: records}, function() {});
	});
	titleInput.value = "";
	urlInput.value = "";
	tagsInput.value = "";
	memoInput.value = "";
};

let searchSubmit = document.getElementById('search-submit');
searchSubmit.onclick = function(element) {
	chrome.storage.sync.get('records', function(data) {
		let records = data.records;
		if(records == undefined){
			return;
		}

		let queryInput = document.getElementById('search-query');
		let urlInput = document.getElementById('search-url');
		let tagsInput = document.getElementById('search-tags');

		let result = Object.keys(records).filter(x => {
			return x.indexOf(queryInput.value) > -1 ||
				records[x].url.indexOf(queryInput.value) > -1 ||
				records[x].tags.join(',').indexOf(queryInput.value) > -1 ||
				records[x].memo.indexOf(queryInput.value) > -1;
		});
		// ええ...
		if(urlInput.value.length > 0){
			result = result.filter(x => records[x].url.indexOf(urlInput.value) > -1);
		}
		if(tagsInput.value.length){
			result = result.filter(x => {
				tagsInput.value.split(',')
					.map(x => x.trim())
					.filter(x => x.length > 0)
					.some(y => records[x].tags.includes(y))
			});
		}

		let content = document.getElementById('content');
		let searchResult = document.getElementById('search-result');
		searchResult.innerHTML = "";
		result.forEach(k => {
			let x = records[k];
			let li = document.createElement('li');
			let btn = document.createElement('button');

			btn.innerText = x.title;
			btn.addEventListener('click', {
				title: x.title,
				url: x.url,
				memo: x.memo,
				tags: x.tags,
				handleEvent: function(){
					document.getElementById('insert-tab').click();

					document.getElementById('insert-title').value = this.title;
					document.getElementById('insert-url').value = this.url;
					document.getElementById('insert-tags').value = this.tags.join(',');
					document.getElementById('insert-memo').value = this.memo;
				}
			});

			li.appendChild(btn);
			searchResult.appendChild(li);
		});
		queryInput.value = "";
	});
};
