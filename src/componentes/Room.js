import React from 'react'
import {Link} from 'react-router-dom';
import ImagenxDefecto from '../imagenes/room-1.jpeg';
import PropTypes from 'prop-types';

export default function Room({room}) {
    const {name, slug, images, price}=room;
    return (
        <article className='room'>
            <div className='img-container'>
                <img src={images[0] || ImagenxDefecto} alt='Pieza simple'></img>
                <div className='price-top'>
                    <h6>${price}</h6>
                    <p>Por cada noche</p>
                </div>
                <Link to={`/rooms/${slug}`} className='btn-primary room-link'>
                    Disponible
                </Link>
            </div>
            <p className='room-info'>{name}</p>
        </article>
    )
}
Room.protoTypes={
    room: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        price: PropTypes.number.isRequired
    })
}