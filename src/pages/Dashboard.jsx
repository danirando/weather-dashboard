import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Dashboard() {
  const { watchlist, setWatchlist, removeCity } = useContext(WeatherContext);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(watchlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWatchlist(items);
  };

  return (
    <div className="container my-4">
      <SearchBar />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cities" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {watchlist.map((city, index) => (
                <Draggable
                  key={city.id}
                  draggableId={city.id.toString()} // ID deve essere stringa
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        marginBottom: "1rem",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <WeatherCard
                        city={city}
                        onRemove={removeCity}
                        dragHandleProps={provided.dragHandleProps} // handle separato
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
