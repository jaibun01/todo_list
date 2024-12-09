"use client";
import { IResDummy, IResGroupUserDepartment, User } from "@/interfaces/IDummy";
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
    return grouped;
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
  const { data: user } = useSWR<IResGroupUserDepartment>(
    URLCommunity,
    fetchData,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <section className="container">
      <div className="inner my-10">
        <h1 className="text-black">1. Auto Delete Todo List</h1>
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
                  <p className="text-black">{item.name}</p>
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
                    <p className="text-black">{item.name}</p>
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
                    <p className="text-black">{item.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================================ 2 .Create data from API (OPTIONAL) ================================*/}
        <div className="border border-gray-300   my-2" />
        <h1 className="text-black mb-2">2. Create data from API (OPTIONAL)</h1>

        <div className="flex items-start gap-2 flex-wrap">
          {user &&
            Object.keys(user).map((department, index) => {
              return (
                <div
                  key={department + index}
                  className="border border-gray-300 w-[300px]  mb-2"
                >
                  <div className="text-black bg-gray-300 flex items-center justify-center h-[50px] font-bold">
                    {department}
                  </div>
                  <div className=" flex items-center justify-center flex-col mt-2">
                    {user[department].map((item, index) => {
                      return (
                        <div
                          key={item.id + index}
                          className="border  border-gray-300 w-[200px] h-[50px] mb-2 flex items-center justify-center flex-col"
                        >
                          <p className="text-black">
                            {item.firstName} {item.lastName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
