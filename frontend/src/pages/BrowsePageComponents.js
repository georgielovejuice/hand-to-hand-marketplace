//May throw undocumented exceptions
export function SearchBar({setSearchBarText, requestQueryingItems}){
	const maxSearchTextCharacters = 64;
	
	async function onSubmit(htmlEventFromForm){
		htmlEventFromForm.preventDefault();
		const htmlForm = htmlEventFromForm.target;
		//FormData() has exceptions but not for this use case
		const inputNameValuePairArray = Array.from((new FormData(htmlForm)).entries());
		const searchBarText = inputNameValuePairArray[0][1];
		const trimmedSearchBarText = searchBarText.trim().slice(0, maxSearchTextCharacters);
	
		setSearchBarText(trimmedSearchBarText);
		requestQueryingItems();
	}
	
	return(
		<form onSubmit={onSubmit}>
			<input
				name="Searchbar"
				placeholder="Search an item"
			/>
			<button>Search</button>
		</form>
	);
}

//May throw undocumented exceptions
export function Item({name, imageURL, priceTHB, itemURL, categories, details}){
	function CategoriesContainer({categories}){
		const categoryElements = [];
		
		for(const category of categories)
			categoryElements.push(<button>{category}</button>);
	
		return(
			<div>
			<label>Category: </label>
			{categoryElements}
			</div>
		);
	}
	
	return (
		<div style={{paddingBottom: "30px"}}>
			<img src={imageURL} style={{width: "350px"}} alt=''/>
			<p>{name}</p>
			<p>{priceTHB}-.</p>
			<CategoriesContainer categories={categories}/>
			<p>{details}</p>
		</div>
	);
}	