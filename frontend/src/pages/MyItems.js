import { useEffect, useState } from "react";
import { IoTrashBin, IoAddSharp } from 'react-icons/io5';
import {
  getMyItems,
  createItem,
  deleteItem,
  updateItem
} from "./MyItems_api.js";

import ItemWindow from '../components/CreateItemWindow.jsx'

export default function MyItems({ token, API_URL}) {
  const [items, setItems] = useState([]);
  const [itemWindowItem, setItemWindowItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState({});
  const [promptDelete, setPromptDelete] = useState(false);
  const [itemWindowPopup, setItemWindowPopup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    imageURL: "",
    priceTHB: "",
    categories: "",
    details: ""
  });

  useEffect(() => {
    loadItems();
  }, [token]);

  function loadItems() {
    getMyItems(token, API_URL).then(setItems);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreate() {
    await createItem(token, {
      ...form,
      priceTHB: Number(form.priceTHB),
      categories: form.categories.split(",").map(c => c.trim())
    }, API_URL);

    setForm({
			name: "",
			imageURL: "",
			priceTHB: "",
			categories: "",
			details: ""
    });

    loadItems();
  }
  
  function ItemDeletePopup(){
    return (
        <div className="absolute block flex justify-center items-center top-0 left-0 w-[99.2vw] h-[100vh] bg-[rgba(255,255,255,0.5)]">
            <div className="flex flex-col items-center">
                <h2 className="pt-[15px] pl-[30px] text-[30px] text-[#FF9E21] font-bold text-center">Delete "{deletingItem.name}"?</h2>
                <div className="left-[50%] mt-[20px]">
                    <button
                        onClick={async () => {
                            await deleteItem(token, deletingItem._id, API_URL);
                            await loadItems();
                            setPromptDelete(false);
                        }}
                        className="mr-[50px] w-[90px] h-[50px] rounded-[10px] bg-[#FF9E21]"
                    >Yes</button>
                    <button 
                        onClick={(e) => {setPromptDelete(false);}} 
                        className="w-[90px] h-[50px] border-[2px] border-[#FF9E21] rounded-[10px] text-[#FF9E21]"
                    >No</button>                 
                </div>
            </div>
      </div>      
    );
  }
  
  function ItemContainer({item}){
    function showEditingWindow(_){
      setItemWindowItem(itemWindowItem => item);
      setItemWindowPopup(true);
    }
    
    const commaForThousandAndPeriodForFraction = 'en-US';
  
    return (
      <button 
        className="flex-none inline-block w-[250px] h-[350px] mb-[30px] mr-[30px] text-left">
      
        <img 
          onClick={showEditingWindow}
          src={item.imageURL} 
          alt="" 
          className="relative top-0 w-[100%] h-[150px] object-cover"
        />
        <div className="relative h-[170px] bg-[#8C3F27] p-[10px]">
          <div onClick={showEditingWindow}>
            <h3 className="text-[22px] font-bold">{item.name}</h3>
            <p className="pt-[5px] text-[15px] font-semibold">{item.priceTHB.toLocaleString(commaForThousandAndPeriodForFraction)}฿</p>
          </div>
          <IoTrashBin 
            onClick={async (_) => {
              setDeletingItem(deletingItem => item);
              setPromptDelete(true);
            }}
            className="absolute right-[0px] bottom-[10px] mt-auto mb-0 mr-[20px] h-[30px]"
          />
        </div>
      </button>
    );
  }
  
  function CreateItemButton(){
    return (
      <button 
        onClick={(_) => {
          setItemWindowItem(itemWindowItem => null);
          setItemWindowPopup(true);
        }}
        className="mt-[20px] flex items-center w-[120px] h-[50px] rounded-[10px] bg-[#7C2808]">
        <IoAddSharp size={40} className="inline-block ml-[5px] mr-[5px]"/>
        <span className="font-semibold text-[18px]">Create</span>
      </button>
    );
  }

  return (
    <div className="w-[99.2vw] h-[100vh] bg-[#FEECD3] p-[35px]"> 
      <h1 className="mt-[-20px] text-[48px] font-[700] text-[#7C2808]">My Items</h1>
      <CreateItemButton/>

      <div className="flex flex-wrap mt-[20px]">
        {items.map(item => <ItemContainer item={item}/>)}
      </div>
      
      {promptDelete && <ItemDeletePopup/>}   
      {
        itemWindowPopup && 
        <ItemWindow 
          closeWindow={() => {
            setItemWindowPopup(false);
          }}
          item={itemWindowItem}
          token={token}
          API_URL={API_URL}
          updateMyItemsPage={loadItems}
        />
      }
    </div>
  );
}
