import {useEffect, useState} from 'react';

export default function ItemPage({itemAPIURL, JWTToken, redirectToChatPage}){
	const [itemObject, setItemObject] = useState({categories: [], rating: 0});
	const [itemImageURLs, setItemImageURLs] = useState([]);
	const [primaryItemImageIndex, setPrimaryItemImageIndex] = useState(0);
	const [error, setError] = useState('');
	
	function RatingContainer(){
		const starImages = [];
		const ratingAsInteger = itemObject.rating.toFixed();		
		for(let i = 0; i < ratingAsInteger; i++){
			starImages.push(<img src="https://pngimg.com/uploads/star/star_PNG41474.png" alt="" className="inline-block w-[20px] h-[20px] mr-[5px]"/>);
		}
		
		return <div>{starImages}</div>
	}
	
	function changePrimaryItemImageIndex(htmlEventFromImg){
		const imgElement = htmlEventFromImg.target;
		const imageURL = imgElement.src;
		const indexOfImageURL = itemImageURLs.indexOf(imageURL);
		setPrimaryItemImageIndex(indexOfImageURL);
	}
	
	useEffect(() => {
		async function getItem(){
			let response;
			try{
				/*
				Based on Window.fetch(), raises
				- AbortError if abort() is called
				- TypeError if
					- request URL is invalid
					- request blocked by permissions policy
					- network error
				- from await
				*/
				response = await fetch(itemAPIURL, {
					method: "GET",
					headers: {authorization: JWTToken}
				});
			}catch(err){
				//No catch for AbortError, React couldn't find its definition
				if(err instanceof TypeError) setError("Couldn't connect to the server.");
				else setError("Error: " + err);
				return;
			}
			
			try{
				/*
				Raises
				- AbortError if abort() is called
				- TypeError if couldn't decode response body
				- SyntaxError if body couldn't be parsed as json
				- something from await
				*/
				const objectFromResponse = await response.json();
				if(!(response.ok)){
					setError(objectFromResponse.message ? objectFromResponse.message 
										: "Received HTTP status " + response.status + " from server.");
					return;
				}

				if((typeof objectFromResponse._id) !== "string"){
					setError("._id attribute of received item object is not a string.");
					return;
				}else if(!(objectFromResponse.categories instanceof Array)){
					setError(".categories attribute of received item object is not Array type.");
					return;
				}
				
				objectFromResponse.rating = 4.25;
				setItemObject(objectFromResponse);
				setItemImageURLs([
					objectFromResponse.imageURL, 
					"https://leonardpaper.com/Content/Images/Product/UP-12Wa.jpg",
					"https://www.chainbaker.com/wp-content/uploads/2023/04/IMG_4692.jpg",
					"https://funcakes.com/content/uploads/2020/08/Donut-600x450.png",
					"https://www.cybermodeler.com/aircraft/f-16/images/intro_f-16ccip.jpg"			
				]);
				setError('');
			}catch (err){
				//No catch for AbortError, React couldn't find its definition
				if(err instanceof TypeError) setError("Couldn't decode response body from server.");		
				else if(err instanceof SyntaxError) setError("Couldn't parse JSON response from server.");						
				else setError("Error: " + err);
			}
		}
		getItem();
	}, 
	[JWTToken, itemAPIURL]);

	return (
		<div className="w-[100vw] pl-[30px] pt-[30px]">
			<div className="float-left max-w-[15%] max-h-[85vh] mr-[30px] overflow-y-auto">
			{
				itemImageURLs.map(url => <img onClick={changePrimaryItemImageIndex} src={url} alt="" className="w-[100%] mb-[30px]"/>)
			}
			</div>
			<div className="float-left h-[85vh] w-[35vw] mr-[30px]">
				<img src={itemImageURLs[primaryItemImageIndex]} alt="" className="float-left w-[100%] h-[100%] object-cover"/>
			</div>
			
			<div className="float-left w-[40%]">
				<h2 className="mt-[20px] text-[56px] font-bold text-wrap">{itemObject.name}</h2>
				<div className="ml-[5px]">
					{itemObject.categories.map(category => <button className="mr-[10px] font-semibold">{category}</button>)}
				</div>
				<h3 className="text-wrap mt-[15px] text-[24px] font-bold">Item Description</h3>
				<p className="text-wrap text-[20px]">{itemObject.details}</p>
				<h3 className="text-wrap mt-[30px] text-[24px] font-bold">Item Condition</h3>
				<div>
				<RatingContainer/>
				</div>
				
				<p className="inline-block text-wrap mr-[30px] mt-[20px] text-[30px]">Price: {itemObject.priceTHB}฿</p>
				<button className="rounded-[20px] w-[70px] bg-green-700 text-[24px]">BUY</button>
				<button className="block rounded-[10px] w-[200px] h-[40px] mt-[20px] bg-zinc-700 text-[24px]">Add to wishlist</button>
				<button onClick={redirectToChatPage} className="block rounded-[10px] w-[200px] h-[45px] mt-[20px] bg-blue-700 text-[24px]">Chat with seller</button>				
			</div>
			<p style={{color: "red"}}>{error}</p>
		</div>
	);
}