"use client";
import { IResDummy, IResponseUser, User } from "@/interfaces/IDummy";
import React, { useState } from "react";
import useSWR from "swr";

const fetchData = async () => {
  try {
    const data = await fetch("https://dummyjson.com/users");
    const dt: IResDummy = await data.json();
    const dat = dt.users;
    const grouped = dat.reduce((acc: { [key: string]: User[] }, user: User) => {
      const department = user.company.department;
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(user);
      return acc;
    }, {});
    const users: { [key: string]: IResponseUser } = {};

    for (const key in grouped) {
      const hair = grouped[key].reduce(
        (acc: { [key: string]: number }, user: User) => {
          const color = user.hair.color;
          if (!acc[color]) {
            acc[color] = 0;
          }
          acc[color] = grouped[key].filter(
            (i) => i.hair.color === color
          ).length;
          return acc;
        },
        {}
      );

      const addressUser = grouped[key].reduce(
        (acc: { [key: string]: string }, user: User) => {
          const name = user.firstName + user.lastName;
          if (!acc[name]) {
            acc[name] = "";
          }
          acc[name] = user.address.postalCode;
          return acc;
        },
        {}
      );
      const age = grouped[key]?.map((i) => i.age);
      const dt: IResponseUser = {
        male: grouped[key]?.filter((i) => i.gender === "male")?.length, // ---> Male Count Summary
        female: grouped[key]?.filter((i) => i.gender === "female")?.length, // ---> Female Count Summary
        ageRange: `${Math.min(...age)}-${Math.max(...age)}`, // ---> Range
        hair: hair, // ---> Color Summary
        addressUser: addressUser, // ---> "firstNamelastName": postalCode
      };
      users[key] = dt;
    }
    return users;
  } catch (error) {
    throw error;
  }
};
const list = [
  {
    type: "Fruit",
    name: "Apple",
  },
  {
    type: "Vegetable",
    name: "Broccoli",
  },
  {
    type: "Vegetable",
    name: "Mushroom",
  },
  {
    type: "Fruit",
    name: "Banana",
  },
  {
    type: "Vegetable",
    name: "Tomato",
  },
  {
    type: "Fruit",
    name: "Orange",
  },
  {
    type: "Fruit",
    name: "Mango",
  },
  {
    type: "Fruit",
    name: "Pineapple",
  },
  {
    type: "Vegetable",
    name: "Cucumber",
  },
  {
    type: "Fruit",
    name: "Watermelon",
  },
  {
    type: "Vegetable",
    name: "Carrot",
  },
];
type Item = {
  type: string;
  name: string;
};
export default function Home() {
  const [listAll, setListAll] = useState<Item[]>(list);
  const [fruit, setFruit] = useState<Item[]>([]);
  const [vegetable, setVegetable] = useState<Item[]>([]);
  const [activeTimeouts, setActiveTimeouts] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});

  const handleMoveToType = (item: Item) => {
    if (item.type === "Fruit") {
      setFruit((prev) => [...prev, item]);
    } else {
      setVegetable((prev) => [...prev, item]);
    }
    setListAll((prev) => prev.filter((list) => list.name !== item.name));

    // Clear any existing timeout for the item
    if (activeTimeouts[item.name]) {
      clearTimeout(activeTimeouts[item.name]);
    }

    // Set a new timeout for the item
    const timeout = setTimeout(() => {
      setListAll((prev) => [...prev, item]);
      if (item.type === "Fruit") {
        setFruit((prev) => prev.filter((i) => i.name !== item.name));
      } else if (item.type === "Vegetable") {
        setVegetable((prev) => prev.filter((i) => i.name !== item.name));
      }

      // Remove the timeout from activeTimeouts
      setActiveTimeouts((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [item.name]: _, ...rest } = prev;
        return rest;
      });
    }, 5000);

    setActiveTimeouts((prev) => ({ ...prev, [item.name]: timeout }));
  };

  const handleMoveToList = (item: Item) => {
    // Clear any existing timeout for the item
    if (activeTimeouts[item.name]) {
      clearTimeout(activeTimeouts[item.name]);
      setActiveTimeouts((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [item.name]: _, ...rest } = prev;
        return rest;
      });
    }

    if (item.type === "Fruit") {
      setFruit((prev) => prev.filter((i) => i.name !== item.name));
    } else {
      setVegetable((prev) => prev.filter((i) => i.name !== item.name));
    }
    setListAll((prev) => [...prev, item]?.filter((i) => i));
  };

  const clickRight = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (e.type === "contextmenu") {
      if (fruit.length === 0 && type === "Fruit") return;
      if (vegetable.length === 0 && type === "Vegetable") return;

      const item = type === "Fruit" ? fruit?.[0] : vegetable?.[0];
      handleMoveToList(item);
    }
  };

  const URLCommunity = [`/community`];
  const { data: user } = useSWR(URLCommunity, fetchData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <section className="container">
      <div className="inner my-10">
        <h1 className="text-white">1. Auto Delete Todo List</h1>
        <div className="flex items-center justify-between flex-wrap mb-10">
          <div>
            {listAll.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    handleMoveToType(item);
                  }}
                  key={item.name + index}
                  className="border border-gray-300 w-[200px] h-[50px] mb-2 flex items-center justify-center flex-col"
                >
                  <p className="text-white">{item.name}</p>
                </div>
              );
            })}
          </div>
          <div
            className="border border-gray-300 w-[300px] min-h-[638px] mb-2"
            onContextMenu={(e) => clickRight(e, "Fruit")}
          >
            <div className="text-black bg-gray-300 flex items-center justify-center h-[50px] font-bold">
              Fruit
            </div>
            <div className=" flex items-center justify-center flex-col mt-2">
              {fruit.map((item, index) => {
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToList(item);
                    }}
                    key={item.name + index}
                    className="border  border-gray-300 w-[200px] h-[50px] mb-2 flex items-center justify-center flex-col"
                  >
                    <p className="text-white">{item.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="border border-gray-300 w-[300px] min-h-[638px] mb-2"
            onContextMenu={(e) => clickRight(e, "Vegetable")}
          >
            <div className="text-black bg-gray-300 flex items-center justify-center h-[50px] font-bold">
              Vegetable
            </div>
            <div className=" flex items-center justify-center flex-col mt-2">
              {vegetable.map((item, index) => {
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();

                      handleMoveToList(item);
                    }}
                    key={item.name + index}
                    className="border  border-gray-300 w-[200px] h-[50px] mb-2 flex items-center justify-center flex-col"
                  >
                    <p className="text-white">{item.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================ 2 .Create data from API (OPTIONAL) ================================*/}
        <div className="border border-gray-300   my-2" />
        <h1 className="text-white mb-2">2. Create data from API (OPTIONAL)</h1>

        {user &&
          Object.keys(user).map((key, index) => {
            return (
              <div
                key={key + index}
                className="border border-gray-300 w-auto mb-3"
              >
                <p className="text-black bg-gray-300 flex items-center justify-center h-auto font-bold">
                  {key}
                </p>
                <div className="p-2 ">
                  <p className="text-white">
                    <b className="underline underline-offset-4">Male:</b> {user[key].male}
                  </p>
                  <p className="text-white">
                    <b className="underline underline-offset-4">Female:</b> {user[key].female}
                  </p>
                  <p className="text-white">
                    <b className="underline underline-offset-4">AgeRange:</b> {user[key].ageRange}
                  </p>
                  <p className="text-white break-words">
                    <b className="underline underline-offset-4">AddressUser:</b>{" "}
                    {JSON.stringify(user[key].addressUser)}
                  </p>
                  <p className="text-white  break-words">
                    <b className="underline underline-offset-4">Hair:</b>{" "}
                    {JSON.stringify(user[key].hair)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
