import {SearchBar, Item} from './BrowsePageComponents.js'

import {useState, useEffect} from 'react'
import {requestServerService} from './BrowsePage_api.js'

//May throw undocumented exceptions
export default function BrowsePage({apiURL}){
	const [errorMessage, setErrorMessage] = useState('');
	//This prevents infinite rerendering every time itemPanels is updated
	const [requestQueryItems, setRequestQueryItems] = useState(true);
	const [itemPanels, setItemPanels] = useState([]);	
	
	//See Specify a Query for MongoDB Node.js Driver,
	//you can do operators like $gt in query.
	const [serviceRequest, setServiceRequest] = useState({
		requestType: "getItems",
		searchBarText: "",
		query: {
		}
	});		
	
	let minimumPriceTHB = 0;
	let maximumPriceTHB = Number.MAX_VALUE;
	
	//May throw undocumented exceptions	
	function FilterContainer(){
		//May throw undocumented exceptions
		function setPriceBoundary(htmlEventFromInput){
			const htmlInput = htmlEventFromInput.target;
			if(htmlInput.name === "minimumPriceTHB"){
				minimumPriceTHB = Number(htmlInput.value);			
				const inputNotANumber = minimumPriceTHB === null;
				if(inputNotANumber) minimumPriceTHB = 0.0;
			}
			else if(htmlInput.name === "maximumPriceTHB"){
				const trimmedString = htmlInput.value.trim();
				maximumPriceTHB = Number(trimmedString);		
				const inputNotANumber = maximumPriceTHB === null;
				if(inputNotANumber) maximumPriceTHB = Number.MAX_VALUE;
				
				//If the input is empty, then the Number constructed from the input is 0,
				//which for maximumPriceTHBimum price of 0, that hides pretty much anything costing more than 0 baht
				//so we check if the trimmed input is empty or not to determinimumPriceTHBe the user's intention
				const unintentionalZeroValue = trimmedString === '';
				if(unintentionalZeroValue) maximumPriceTHB = Number.MAX_VALUE;
			}
		}
		return(
			<form style={{paddingBottom: '5px'}} onChange={setPriceBoundary}>
				<input
					name="minimumPriceTHB"
					placeholder="from -."
					style={{width: "75px"}}
				/>
				<input
					name="maximumPriceTHB"
					placeholder="to -."
					style={{width: "75px"}}
				/>
			</form>
		);
	}
	
	//Only place for an await/async function to be in a component
	useEffect(() => {
		//May throw undocumented exceptions
		function handleObjectFromResponse(object){
			const parsedItemObjects = [];
			
			if(!(object.items instanceof Array)) 
				throw new SyntaxError("items attribute of response not an array.");
			for(const item of (object.items)){
				if(typeof item.name !== "string"){
					setErrorMessage("name attribute of item is not string type. Ignored item...");
					continue;
				}else if(typeof item.priceTHB !== "number"){
					setErrorMessage("priceTHB attribute of item is not float type. Ignored item...");
					continue;
				}else if(typeof item.imageURL !== "string"){
					setErrorMessage("imageURL attribute of item is not string type. Ignored item...");
					continue;
				}else if(!(item.categories instanceof Array)){
					setErrorMessage("categories attribute of item is not String type. Ignored attribute.");
					item.categories = [];
				}else if(typeof item.details !== "string"){
					setErrorMessage("details attribute of item is not string type. Ignored attribute...");	
					item.details = '';					
				}
				
				let invalidCategoryType = false;
				for(const category of item.categories){
					if(typeof category !== "string"){
						setErrorMessage("category in categories attribute of item is not string type. Ignored attribute...");	
						invalidCategoryType = true;
						break;
					}
				}
				if(invalidCategoryType) item.categories = [];
				parsedItemObjects.push(item);
			}
			return parsedItemObjects;
		}			
		
		//May throw undocumented exceptions
		async function queryItemsToItemPanels(){
			if(requestQueryItems){
				//May throw undocumented exceptions
				const itemObjects = await requestServerService(apiURL, JSON.stringify(serviceRequest), setErrorMessage, handleObjectFromResponse);
				if(!itemObjects){
					//If itemObjects is null, requestServerService sets the error message via setErrorMessage.
					return;
				}
				
				const itemPanelArray = [];
				for(const item of itemObjects){
					itemPanelArray.push(<Item 
						name={item.name} 
						imageURL={item.imageURL} 
						priceTHB={item.priceTHB} 
						itemURL={item.itemURL}
						categories={item.categories}
						details={item.details}
					/>);
				}
				setItemPanels(itemPanelArray);
				setRequestQueryItems(false);
			}
		}
		
		queryItemsToItemPanels();
		}, 
		[requestQueryItems, apiURL, serviceRequest]
	);
	
	return (
		<div style={{paddingTop: '15px'}}>
		<SearchBar 
			setSearchBarText={(searchBarText) =>{
				setServiceRequest({
					requestType: serviceRequest.requestType,
					searchBarText: searchBarText,
					query: {priceTHB: {$lte: maximumPriceTHB, $gte: minimumPriceTHB}},
				});
			}}
			requestQueryingItems={() => {
				setRequestQueryItems(true);
			}}
		/>
		<FilterContainer/>
		{itemPanels}
		<p style={{color: "red"}}>{errorMessage}</p>
		</div>
	);
}