
import React, {Component} from 'react';
import datos from './data';
const RoomContext = React.createContext();

class RoomProvider extends Component{
    
    state={
        rooms:[],
        roomsOrdenados:[],
        roomsCaracteristicas:[],
        loading: true,
        tipo:'all',
        capacidad:1,
        precio: 0,
        precioMin:0,
        precioMax:0,
        tamanioMin:0,
        tamanioMax:0,
        desayuno:true,
        mastocas:false
    };
    formatearDatos(items){
        let datosTmp = items.map(item=>{
            let id = item.sys.id;
            let images = item.fields.images.map(image=>image.fields.file.url);
            let room = {...item.fields,images,id}
            return room;
        });
        return datosTmp;
    }
    componentDidMount(){//Hacer todo esto cuando este componente pase al DOM
        let rooms = this.formatearDatos(datos);
        let roomsCaracteristicas = rooms.filter(room=>room.featured===true);
        let precioMax = Math.max(...rooms.map(item=>item.price));
        let tamanioMax = Math.max(...rooms.map(item=>item.size));
        this.setState({//asignando valores a las variables del state
            rooms, //rooms:rooms
            roomsCaracteristicas,
            roomsOrdenados:rooms,//
            loading:false,
            precio: precioMax,
            precioMax,
            tamanioMax
        });
    }
    getRoom = (slug)=>{
        let tempRooms = [...this.state.rooms];
        let room = tempRooms.find((room)=>room.slug===slug);
        return room;
    }
    handleChange = event =>{
        const target = event.target;
        const value = target.type === 'checkbox'? target.checked:target.value; 
        const name = event.target.name;
        this.setState({
            [name]:value
        }, this.filterRooms)
    }
    filterRooms = ()=>{
        let tempRooms = [...this.state.rooms];
        let capacidad = parseInt(this.state.capacidad);
        let precio = parseInt(this.state.precio);
        //Filtro por tipo
        
        if(this.state.tipo !== 'all'){
            tempRooms = tempRooms.filter(room=>room.type===this.state.tipo);
        }
        //Filtro por capacidad
        if(capacidad !==1){
            tempRooms = tempRooms.filter(room=>room.capacity >= capacidad)
        }
        //Filtro por precio
        tempRooms = tempRooms.filter(room=>room.price<=precio)
        
        //Filtro por tamaño
        tempRooms = tempRooms.filter(room=>
            room.size>=this.state.tamanioMin && room.size<=this.state.tamanioMax);
        
        //Filtro por desayuno
        
        if(this.state.desayuno){
            tempRooms = tempRooms.filter(room=>room.breakfast);
        }
        //Filtro por mascota
        if(this.state.mastocas){
            tempRooms = tempRooms.filter(room=>room.pets);
        }

        this.setState({
            roomsOrdenados: tempRooms
        })
        //console.log(tempRooms)
    }
    render(){
        return(
            <RoomContext.Provider value={{
                ...this.state,
                getRoom: this.getRoom,
                handleChange: this.handleChange
            }}>
                {this.props.children}
            </RoomContext.Provider>
        )
    }
}
const RoomConsumer = RoomContext.Consumer;
export function WithRoomConsumer(Component){
    return function ConsumerWrapper(props){
        return <RoomConsumer>
            {value=><Component {...props} context={value}></Component>}
        </RoomConsumer>
    }
}
export {RoomProvider, RoomConsumer, RoomContext}