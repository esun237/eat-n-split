import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [friendSplitBill, setFriendSplitBill] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
    setFriendSplitBill(null);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSplitBillForm(friend) {
    setFriendSplitBill(friendSplitBill === friend ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(addBalance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === friendSplitBill.id
          ? { ...friend, balance: friend.balance + addBalance }
          : friend
      )
    );

    setFriendSplitBill(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSplitBillForm={handleSplitBillForm}
          friendSplitBill={friendSplitBill}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {friendSplitBill && (
        <FormSplitBill
          friendSplitBill={friendSplitBill}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSplitBillForm, friendSplitBill }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSplitBillForm={onSplitBillForm}
          friendSplitBill={friendSplitBill}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSplitBillForm, friendSplitBill }) {
  return (
    <li className={friendSplitBill?.id === friend.id ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}Euro
        </p>
      )}
      {friend.balance === 0 && (
        <p className="grey">You and {friend.name} are even</p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}Euro
        </p>
      )}
      <Button onClick={() => onSplitBillForm(friend)}>
        {friendSplitBill?.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id };
    console.log(newFriend);
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑🏻‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => {
          setImage(e.target.value);
        }}
      />
      <Button>Submit</Button>
    </form>
  );
}

function FormSplitBill({ friendSplitBill, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [whoPayBill, setWhoPayBill] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;
    const addBalance = whoPayBill === "user" ? friendExpense : -userExpense;
    onSplitBill(addBalance);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friendSplitBill.name} </h2>

      <label>Bill Amount 💰</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expense 💳</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>{friendSplitBill.name}'s expense 💳</label>
      <input type="text" disabled value={friendExpense} />

      <label>Who is paying the bill?</label>
      <select
        value={whoPayBill}
        onChange={(e) => setWhoPayBill(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friendSplitBill.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
