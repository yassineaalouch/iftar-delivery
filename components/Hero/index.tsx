import Image from 'next/image';

const Hero = () => {
  return (
    <>
        {/* <div className='w-full flex h-screen bg-gradient-to-l from-[#c5ec6f] to-white  '> */}
        <div className='w-full flex h-[90vh] bg-[#c5ec6f]  '>
          <div className='w-1/2 h-full pl-10 flex flex-col justify-center items-end'>
              <div className='font-[900] text-5xl text-[#FD8D14]'>Un Iftar délicieux, sans effort et à votre porte en un instant !</div>
              <div className='text-black '>Gagnez du temps, profitez du goût – Iftar-Delivery s’occupe du reste !</div>
          </div>
          <div className='w-1/2 h-full pt-5 relative flex justify-center items-center'>
            <div className='w-full flex justify-center items-end'>
              <div className='w-3/4'>
               <Image className=' rounded-full' alt='mm' src="/images/hero/IftarHero.jpg" width={400} height={400} layout="responsive" loading='lazy'/>
              </div>
            </div>
              <Image className=' rounded-full absolute bottom-[20rem] left-0 h-28 w-28' alt='mm' src="/images/hero/IftarHero.jpg" width={100} height={100} loading='lazy'/>
              <Image className=' rounded-full absolute bottom-40 -left-10 h-28 w-28' alt='mm' src="/images/hero/IftarHero.jpg" width={100} height={100} loading='lazy'/>
              <Image className=' rounded-full absolute bottom-0 left-10 h-28 w-28' alt='mm' src="/images/hero/IftarHero.jpg" width={100} height={100} loading='lazy'/>
          </div>
        </div>
    </>
);
};

{/* <div className="w-full relative h-screen flex justify-end">
  <div className="w-1/3 h-[120%] absolute -top-10 -right-20 bg-yellow-500 rounded-l-full">
    <div className="relative w-full h-full ">
      <div className="absolute bg-red-200 w-full h-1/2 -left-5 top-1/2 
                      transform -translate-x-1/2 -translate-y-1/2">
      </div>
    </div>
  </div>
</div> 
*/}





    // <section className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#2c5545] to-[#8a6240] flex items-center relative overflow-hidden">
    //   {/* Dynamic Stars Background */}
    //   <div className="absolute inset-0 opacity-25 animate-twinkle bg-[url('/patterns/star-pattern.png')] bg-repeat-space"></div>
      
    //   {/* Enhanced Islamic Pattern Overlay */}
    //   <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/imgres?q=lantern%20ramadan%20png&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fpng-clipart%2F20210312%2Fourmid%2Fpngtree-ramadan-lanterns-png-image_3045357.jpg&imgrefurl=https%3A%2F%2Fpngtree.com%2Fso%2Framadan-lantern&docid=Lzp6qENmZwdw8M&tbnid=uneB1IN2EvarIM&vet=12ahUKEwjl_5eVstOLAxWd1gIHHRv3AhEQM3oECBwQAA..i&w=360&h=360&hcb=2&ved=2ahUKEwjl_5eVstOLAxWd1gIHHRv3AhEQM3oECBwQAA')] bg-repeat bg-[length:50px_50px] mix-blend-soft-light animate-slide-pattern"></div>

    //   {/* Main Content */}
    //   <div className="container mx-auto px-4 py-20 text-center text-white relative z-10">
    //     {/* Animated Crescent Moon */}
    //     <div className="absolute right-10 top-20 animate-float-glow">
    //       <img 
    //         src="/images/hero/moon.png" 
    //         alt="Crescent Moon" 
    //         className="w-32 h-32 opacity-90 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" 
    //       />
    //     </div>

    //     {/* Enhanced Mosque Silhouette */}
    //     <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[url('/images/hero/mosque.png')] bg-contain bg-no-repeat bg-bottom opacity-50 animate-mosque-rise"></div>

    //     <h1 className="font-arabic text-7xl md:text-8xl lg:text-9xl mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-golden via-white to-golden animate-shimmer mt-[-60px]">
    //       رمضان كريم
    //     </h1>

    //     <h2 className="text-2xl md:text-3xl mb-8 text-golden font-medium bg-white/10 backdrop-blur-md px-10 py-4 rounded-full inline-block border border-white/20 shadow-lg hover:shadow-golden/20 transition-all duration-500 transform hover:scale-105">
    //       ✨ Bghiti ftour yweslek hta lbab dar...✨
    //     </h2>

        

    //     <button className="bg-gradient-to-r from-golden via-[#f3c75f] to-[#da9f38] text-neutral-900 px-12 py-6 rounded-full text-lg font-bold 
    //                      hover:bg-gradient-to-l transition-all transform hover:scale-105 duration-300 
    //                      shadow-[0_0_20px_rgba(218,159,56,0.3)] hover:shadow-[0_0_30px_rgba(218,159,56,0.5)]
    //                      flex items-center gap-4 mx-auto group">
          
    //       <span className="tracking-wide">Commander mn 3ndna daba</span>
          
    //     </button>

    //     {/* Animated Floating Lanterns */}
    //     <div className="absolute left-[10%] top-1/4 animate-float-lantern-1">
    //       <img 
    //         src="/images/hero/lantern.png" 
    //         className="w-20 opacity-80 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
    //         alt="Lantern" 
    //       />
    //     </div>
    //     <div className="absolute right-[15%] top-1/3 animate-float-lantern-2">
    //       <img 
    //         src="/images/hero/lantern.png" 
    //         className="w-16 opacity-90 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
    //         alt="Lantern" 
    //       />
    //     </div>
    //     <div className="absolute left-[20%] bottom-1/4 animate-float-lantern-3">
    //       <Image 
    //         src="/images/hero/lantern.png" 
    //         className="w-14 opacity-70 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
    //         alt="Lantern" 
    //         fill
    //       />
    //     </div>
    //   </div>

    //   {/* Enhanced Texture Overlay */}
    //   <div className="absolute inset-0 bg-[url('/textures/noise-texture.png')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
    // </section>

export default Hero;
