import React, { useState } from 'react';
import Select from 'react-select';
import heroes_raw_data from '../constants/heroes.json'
import items_raw_data from '../constants/items.json'
import axios from 'axios';

let items_data = {};
for (const key in items_raw_data) {
    let id = items_raw_data[key].id;
    items_data[id] = {
        "image": "https://cdn.cloudflare.steamstatic.com/" + items_raw_data[key].img,
    }

    let name = key;
    if (items_raw_data[key].hasOwnProperty("dname")) {

        name = items_raw_data[key]["dname"];
    }

    items_data[id]["name"] = name;
}

let heroes_data = {};
let heroes_for_select = [];
for (const key in heroes_raw_data) {
    heroes_data[heroes_raw_data[key].id] = {
        "name": heroes_raw_data[key].localized_name,
        "image": "https://cdn.cloudflare.steamstatic.com/" + heroes_raw_data[key].img,
    }

    heroes_for_select.push({
        "label": heroes_raw_data[key].localized_name,
        "value": heroes_raw_data[key].id
    })
}

const categories_mapper = {
    "start_game_items": "Start game items",
    "early_game_items": "Early game items",
    "mid_game_items": "Mid game items",
    "late_game_items": "Late game items"
}



const ItemsRecommendation = () => {
    const [selectedHero, setSelectedHero] = useState(null);
    const [displayItems, setDisplayItems] = useState({});

    const handleSelectChange = async (selectedOption) => {
        setSelectedHero(selectedOption.value);
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getItemsPopularity`, { "id": selectedOption.value });
        console.log(response.data);
        let updatedDisplayItems = {};
        Object.keys(response.data).map((category) => {
            let displayCategory = categories_mapper[category]
            updatedDisplayItems[displayCategory] = response.data[category].slice(0, 6);
            updatedDisplayItems[displayCategory] = updatedDisplayItems[displayCategory].map((pair) => (pair[0]));
        })

        setDisplayItems(updatedDisplayItems);
        console.log(updatedDisplayItems);
    };


    return (
        <div style={{ textAlign: 'center' }}>
            <br />
            <Select
                value={selectedHero}
                onChange={handleSelectChange}
                options={heroes_for_select}
                isClearable
                placeholder="Type hero name..."
                styles={{
                    option: (provided, state) => ({
                        ...provided,
                        textAlign: 'left'
                    })
                }}
            />
            <br />
            {selectedHero && (
                <div>
                    <h2>{heroes_data[selectedHero]["name"]}</h2>
                    <img
                        src={heroes_data[selectedHero]["image"]}
                        alt={heroes_data[selectedHero]["name"]}
                        title={heroes_data[selectedHero]["name"]}
                        style={{ width: '250px', height: '150px', marginBottom: '20px' }}
                    />
                </div>
            )}
            <br />
            {displayItems &&
                Object.entries(displayItems).map(([category, items]) => (
                    <div key={category}>
                        <h3 style={{ marginTop: '20px' }}>{category}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {items.map((item, index) => (
                                <div key={index} style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <img
                                        src={items_data[item]["image"]}
                                        alt={items_data[item]["name"]}
                                        title={items_data[item]["name"]}
                                        style={{ width: '130px', height: '95px', marginBottom: '5px' }}
                                    />
                                    <p>{items_data[item]["name"]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );

};

export default ItemsRecommendation;