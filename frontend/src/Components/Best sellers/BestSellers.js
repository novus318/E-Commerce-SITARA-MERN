import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../Recomendation/Recomendation.css'
import { Link } from 'react-router-dom';

function BestSellers({products}) {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 2000, min: 1100 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 1000, min: 800 },
          items: 4
        },
        tablet: {
          breakpoint: { max: 800, min: 400 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 400, min: 0 },
          items: 1
        }
      }
  return (
    <div className='mt-4 mb-4'>
      <div className='mb-4 ms-4'>
        <h2 className='head-t'>Best Sellers</h2>
      </div>
      <div>
      <Carousel responsive={responsive}>
      {products?.map(p =>(
           
		   <div className="m-auto product-card mb-3">
		  <Link to={`/product/${p.slug}`} key={p._id}>
		   <div className="product-tumb">
			   <img className='p-img' src={`/api/v1/product/product-photo1/${p._id}`} alt={p.name}/>
		   </div>
		   <div className="product-details">
			   <div className='p-head'>{p.name}</div>
			   <p>{p.description.substring(0,40)}...</p>
			   <div className="product-bottom-details">
		   <div className="product-price">₹ {p.price}</div>
			   </div>
		   </div>
		   </Link>
	   </div> 
	   ))}
</Carousel>
    </div>
    </div>
  )
}

export default BestSellers
