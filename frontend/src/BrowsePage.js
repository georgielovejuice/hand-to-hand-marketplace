import {useState, useEffect} from 'react'
import {requestServerService} from './utils.js'

export default function BrowsePage({apiURL}){
	const [errorMessage, setErrorMessage] = useState('');
	//We request only if needed, once.
	const [requestQueryItems, setRequestQueryItems] = useState(true);
	const [itemPanels, setItemPanels] = useState([]);
	
	function Item({name, imageURL, priceTHB, itemURL}){	
		return (
			<div>
				<img src={imageURL} style={{width: "350px"}}/>
				<p>{name}</p>
				<p>{priceTHB}-.</p>
			</div>
		);
	}	
	
	//See Specify a Query for MongoDB Node.js Driver,
	//you can do operators like $gt in query.
	const serviceRequest = {
		requestType: "getItems",
		query: {
		}
	};	
	
	//Only place for an await/async function to be in a component
	useEffect(() => {
		function handleObjectFromResponse(object){
			const parsedItemObjects = [];
			
			if(!(object.items instanceof Array)) 
				throw new SyntaxError("items attribute of response not an array.");
			for(const item of (object.items)){
				if(typeof item.name !== "string"){
					setErrorMessage("name attribute of item is not String type. Ignored item...");
					continue;
				}else if(typeof item.priceTHB !== "number"){
					setErrorMessage("priceTHB attribute of item is not float type. Ignored item...");
					continue;
				}else if(typeof item.imageURL !== "string"){
					setErrorMessage("imageURL attribute of item is not String type. Ignored item...");
					continue;
				}else if(typeof item.itemURL !== "string"){
					setErrorMessage("itemURL attribute of item is not String type. Ignored item...");
					continue;
				}
				parsedItemObjects.push(item);
			}
			return parsedItemObjects;
		}			
		
		async function queryItemsToItemPanels(){
			if(requestQueryItems){
				//Can raise undocumented exceptions or programmer errors
				const itemObjects = await requestServerService(apiURL, JSON.stringify(serviceRequest), setErrorMessage, handleObjectFromResponse);
				const itemPanelArray = [];
				for(const item of itemObjects){
					console.log(item);
					itemPanelArray.push(<Item 
						name={item.name} 
						imageURL={item.imageURL} 
						priceTHB={item.priceTHB} 
						itemURL={item.itemURL}
					/>);
				}
				setItemPanels(itemPanelArray);
				setRequestQueryItems(false);
			}
		}
		queryItemsToItemPanels();
		}, 
		[requestQueryItems]
	);
	
	return (
		<div>
		{itemPanels}
		<p style={{color: "red"}}>{errorMessage}</p>
		</div>
	);
}