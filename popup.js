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
	let memoInput = document.getElementById('insert-memo');
	let record = {
		title: titleInput.value,
		url: urlInput.value,
		memo: memoInput.value
	};
	chrome.storage.sync.get('records', function(data) {
		let records = data.records;
		if(records == undefined){
			records = {};
		}
		records[record.title] = record;
		chrome.storage.sync.set({records: records}, function() {});
	});
	titleInput.value = "";
	urlInput.value = "";
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

		let result = Object.keys(records).filter(x => {
			console.log(records);

			return x.indexOf(queryInput.value) > -1 ||
				records[x].url.indexOf(queryInput.value) > -1 ||
				records[x].memo.indexOf(queryInput.value) > -1;
		});

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
				handleEvent: function(){
					document.getElementById('insert-tab').click();

					document.getElementById('insert-title').value = this.title;
					document.getElementById('insert-url').value = this.url;
					document.getElementById('insert-memo').value = this.memo;
				}
			});

			li.appendChild(btn);
			searchResult.appendChild(li);
		});
		queryInput.value = "";
	});
};
