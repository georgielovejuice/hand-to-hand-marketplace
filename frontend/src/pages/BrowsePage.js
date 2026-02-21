import {SearchBar, Item} from './BrowsePageComponents.js'

import {useState, useEffect} from 'react'
import {requestServerService} from './BrowsePage_api.js'

//May throw undocumented exceptions
export default function BrowsePage({apiURL, setViewingItemID}){
	const [errorMessage, setErrorMessage] = useState('');
	const [requestQueryItems, setRequestQueryItems] = useState(true);
	const [itemPanels, setItemPanels] = useState([]);	
	
	const buildImageUrl = (imageURL) => {
		// Backend already returns full S3 URLs, no need to process
		return imageURL;
	};
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
				if(typeof item.title !== "string"){
					setErrorMessage("title attribute of item is not string type. Ignored item...");
					continue;
				}else if(typeof item.price !== "number"){
					setErrorMessage("price attribute of item is not a number. Ignored item...");
					continue;
				}else if(!(item.images instanceof Array) || item.images.length === 0){
					setErrorMessage("images attribute of item is not a non-empty array. Ignored item...");
					continue;
				}else if(typeof item.description !== "string"){
					setErrorMessage("description attribute of item is not string type. Ignored attribute...");	
					item.description = '';					
				}
				
				// Convert new schema to old schema for compatibility
				const compatibleItem = {
					_id: item._id,
					name: item.title,
					priceTHB: item.price,
					imageURL: item.images[0] || null,  // Use first image
					details: item.description,
					categories: item.category ? [item.category] : [],
					...item  // Include all other properties
				};
				
				parsedItemObjects.push(compatibleItem);
			}
			return parsedItemObjects;
		}			
		
		//May throw undocumented exceptions
		async function queryItemsToItemPanels(){
			if(requestQueryItems){
				//May throw undocumented exceptions
				const queryEndpoint = apiURL + '/items/query';
				const itemObjects = await requestServerService(queryEndpoint, JSON.stringify(serviceRequest), setErrorMessage, handleObjectFromResponse);
				if(!itemObjects){
					//If itemObjects is null, requestServerService sets the error message via setErrorMessage.
					return;
				}
				
				const itemPanelArray = [];
				for(const item of itemObjects){
					itemPanelArray.push(<Item 
						key={item._id}
						name={item.name} 
						imageURL={buildImageUrl(item.imageURL)} 
						priceTHB={item.priceTHB} 
						categories={item.categories}
						details={item.details}
						itemID={item._id}
						setViewingItemID={setViewingItemID}
					/>);
				}
				setItemPanels(itemPanelArray);
				setRequestQueryItems(false);
			}
		}
		
		queryItemsToItemPanels();
		}, 
		[requestQueryItems, apiURL, serviceRequest, setViewingItemID]
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