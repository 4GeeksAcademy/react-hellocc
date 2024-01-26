import React, { useState, useEffect } from "react";

const Home = () => {
    const getUserName = (forceChange) => {
        let user = localStorage.getItem('username');

        if (!user || forceChange) {
            do {
                user = prompt("Please enter your ToDo list API id", "");
            } while (user.length === 0);

            localStorage.setItem('username', user);
        }

        return user;
    };

    const [inputValue, setInputValue] = useState("");
    const [list, setList] = useState([]);
    const [username, setUsername] = useState(getUserName(false));

    const postData = () => {
        fetch('https://playground.4geeks.com/apis/fake/todos/user/' + username, {
            method: "PUT",
            body: JSON.stringify(list),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/' + username);
                const data = await response.json();

                if (!data.length) {
                    postData(); // Create a new list if no data is returned.
                } else {
                    setList(data); // Set the fetched data as the current list.
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [username]);

    useEffect(() => {
        if (list.length > 1) {
            postData();
        }
    }, [list]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            const newItem = { label: inputValue, done: false };
            setList([...list, newItem]);
            setInputValue(""); // Clear the input box.
        }
    };

    const handleDelete = (index) => {
        const newList = [...list];
        newList.splice(index, 1);
        setList(newList);
    };

    const handleClearAll = () => {
        setList([]);
    };

    return (
        <div className="text-center">
            <h1>Todo list for: {username}</h1>
            <hr />
            <div>
                <input
                    type="text"
                    placeholder="Add tasks here"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleClearAll}>Clear All</button>
                <button onClick={() => setUsername(getUserName(true))}>Change Username</button>
            </div>
            {
                list.length <= 1 ?
                    (<p>No tasks, add a task</p>) :
                    (
                        <div>
                            {
                                list.map((item, index) => {
                                    if (index >= 1) {
                                        return (
                                            <div key={index} style={{ padding: '5px' }}>
                                                <span>{item.label}</span>
                                                <button onClick={() => handleDelete(index)}>Delete</button>
                                            </div>
                                        )
                                    }
                                    return null;
                                })
                            }
                        </div>
                    )
            }
        </div>
    );
}

export default Home;