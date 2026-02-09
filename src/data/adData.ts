export interface AdBanner {
  id: string;
  name: string;
  link: string;
  imgUrl?: string;
  trackingUrl?: string;
  pcImg?: string;
  pcTrack?: string;
  moLink?: string;
  moImg?: string;
  moTrack?: string;
}

export const WING_ADS: AdBanner[] = [
  {
    id: "klook_wing",
    name: "Klook",
    link: "https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/klook/20181011/5bbee16a86b6b_160_600.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=0012&l_cd1=2&l_cd2=0"
  },
  {
    id: "agoda_wing",
    name: "Agoda",
    link: "https://click.linkprice.com/click.php?m=agoda&a=A100702487&l=0WRV&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/agoda/20200429/5ea8ce4a79e35_160_600.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=agoda&a_id=A100702487&p_id=0000&l_id=0WRV&l_cd1=2&l_cd2=0"
  },
  {
    id: "hotels_wing",
    name: "Hotels.com",
    link: "https://click.linkprice.com/click.php?m=hotelskr&a=A100702487&l=0010&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/hotelskr/20160718/578c202438a69_160_600.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=hotelskr&a_id=A100702487&p_id=0000&l_id=0010&l_cd1=2&l_cd2=0"
  },
  {
    id: "interpark_wing",
    name: "NOL Interpark",
    link: "https://click.linkprice.com/click.php?m=interpark3&a=A100702487&l=Avyx&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/interpark3/20241121/673eb42d807c6_160x600.png",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=interpark3&a_id=A100702487&p_id=0000&l_id=Avyx&l_cd1=2&l_cd2=0"
  },
  {
    id: "rakuten_wing",
    name: "Rakuten Travel",
    link: "https://click.linkprice.com/click.php?m=rakutentr&a=A100702487&l=EtSC&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/rakutentr/20230807/G000zNVfRG000_rakutentr_160_600.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=rakutentr&a_id=A100702487&p_id=0000&l_id=EtSC&l_cd1=2&l_cd2=0"
  },
  {
    id: "rentalcars_wing",
    name: "Rentalcars",
    link: "https://click.linkprice.com/click.php?m=rentalcars&a=A100702487&l=0004&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/rentalcars/20180607/5b18e34c3d92d_160_600.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=rentalcars&a_id=A100702487&p_id=0000&l_id=0004&l_cd1=2&l_cd2=0"
  }
];

export const BOTTOM_ADS: AdBanner[] = [
  {
    id: "agoda_bottom",
    name: "Agoda",
    link: "https://click.linkprice.com/click.php?m=agoda&a=A100702487&l=pDTY&u_id=",
    pcImg: "https://img.linkprice.com/files/glink/agoda/20200429/5ea8ce4a98260_728_90.jpg",
    pcTrack: "http://track.linkprice.com/lpshow.php?m_id=agoda&a_id=A100702487&p_id=0000&l_id=pDTY&l_cd1=2&l_cd2=0",
    moLink: "https://click.linkprice.com/click.php?m=agoda&a=A100702487&l=0002&u_id=",
    moImg: "http://img.agoda.net/images/partnermarketing/kr/Ads-KR_468x60.jpg",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=agoda&a_id=A100702487&p_id=0000&l_id=0002&l_cd1=2&l_cd2=0"
  },
  {
    id: "hotels_bottom",
    name: "Hotels.com",
    link: "https://click.linkprice.com/click.php?m=hotelskr&a=A100702487&l=0Ne1&u_id=",
    pcImg: "https://img.linkprice.com/files/glink/hotelskr/20250708/u00mlk4FS4W00_00000_V1_728x90_45478_SPA.jpg",
    pcTrack: "http://track.linkprice.com/lpshow.php?m_id=hotelskr&a_id=A100702487&p_id=0000&l_id=0Ne1&l_cd1=2&l_cd2=0",
    moLink: "https://click.linkprice.com/click.php?m=hotelskr&a=A100702487&l=0005&u_id=",
    moImg: "http://img.linkprice.com/files/glink/hotelskr/20160718/578c20241efeb_468_60.jpg",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=hotelskr&a_id=A100702487&p_id=0000&l_id=0005&l_cd1=2&l_cd2=0"
  },
  {
    id: "interpark_bottom",
    name: "NOL Interpark",
    link: "https://click.linkprice.com/click.php?m=interpark3&a=A100702487&l=hVJs&u_id=",
    pcImg: "https://img.linkprice.com/files/glink/interpark3/20241121/673eb48a07940_728x90.png",
    pcTrack: "http://track.linkprice.com/lpshow.php?m_id=interpark3&a_id=A100702487&p_id=0000&l_id=hVJs&l_cd1=2&l_cd2=0",
    moLink: "https://click.linkprice.com/click.php?m=interpark3&a=A100702487&l=cmu1&u_id=",
    moImg: "https://img.linkprice.com/files/glink/interpark3/20241121/673eb47e93dbf_468x60.png",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=interpark3&a_id=A100702487&p_id=0000&l_id=cmu1&l_cd1=2&l_cd2=0"
  },
  {
    id: "airalo_bottom",
    name: "Airalo",
    link: "https://click.linkprice.com/click.php?m=airalo&a=A100702487&l=F8j8&u_id=",
    pcImg: "https://img.linkprice.com/files/glink/airalo/20230406/e00xVgcWzw680_728_90.png",
    pcTrack: "http://track.linkprice.com/lpshow.php?m_id=airalo&a_id=A100702487&p_id=0000&l_id=F8j8&l_cd1=2&l_cd2=0",
    moLink: "https://click.linkprice.com/click.php?m=airalo&a=A100702487&l=ulxJ&u_id=",
    moImg: "https://img.linkprice.com/files/glink/airalo/20230406/e00xVgcWzw680_468_60.png",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=airalo&a_id=A100702487&p_id=0000&l_id=ulxJ&l_cd1=2&l_cd2=0"
  },
  {
    id: "rakuten_bottom",
    name: "Rakuten",
    link: "https://click.linkprice.com/click.php?m=rakutentr&a=A100702487&l=EtSC&u_id=",
    pcImg: "",
    pcTrack: "", 
    moLink: "https://click.linkprice.com/click.php?m=rakutentr&a=A100702487&l=7KKu&u_id=",
    moImg: "https://img.linkprice.com/files/glink/rakutentr/20230807/000aduUW00000_rakutentr_468_60.jpg",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=rakutentr&a_id=A100702487&p_id=0000&l_id=7KKu&l_cd1=2&l_cd2=0"
  },
  {
    id: "rentalcars_bottom",
    name: "Rentalcars",
    link: "https://click.linkprice.com/click.php?m=rentalcars&a=A100702487&l=0004&u_id=",
    pcImg: "",
    pcTrack: "",
    moLink: "https://click.linkprice.com/click.php?m=rentalcars&a=A100702487&l=0007&u_id=",
    moImg: "http://img.linkprice.com/files/glink/rentalcars/20180607/5b18e34c4d6d6_468_60.jpg",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=rentalcars&a_id=A100702487&p_id=0000&l_id=0007&l_cd1=2&l_cd2=0"
  },
  {
    id: "klook_bottom",
    name: "Klook",
    link: "https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0012&u_id=",
    pcImg: "",
    pcTrack: "",
    moLink: "https://click.linkprice.com/click.php?m=klook&a=A100702487&l=0015&u_id=",
    moImg: "http://img.linkprice.com/files/glink/klook/20181011/5bbee16abf19a_468_60.jpg",
    moTrack: "http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=0015&l_cd1=2&l_cd2=0"
  }
];

export const GRID_ADS: AdBanner[] = [
  {
    id: "klook_grid",
    name: "클룩 (액티비티/티켓)",
    link: "https://click.linkprice.com/click.php?m=klook&a=A100702487&l=kzBe&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/klook/20221221/0000000000000_클룩배너.png",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=klook&a_id=A100702487&p_id=0000&l_id=kzBe&l_cd1=2&l_cd2=0"
  },
  {
    id: "agoda_grid",
    name: "아고다 (숙소 최저가)",
    link: "https://click.linkprice.com/click.php?m=agoda&a=A100702487&l=0013&u_id=",
    imgUrl: "http://img.linkprice.com/files/glink/agoda/20191122/5dd79f9315f7b_120_60.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=agoda&a_id=A100702487&p_id=0000&l_id=0013&l_cd1=2&l_cd2=0"
  },
  {
    id: "hotels_grid",
    name: "호텔스닷컴",
    link: "https://click.linkprice.com/click.php?m=hotelskr&a=A100702487&l=RlLG&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/hotelskr/20230427/0000000000000_120x60.png",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=hotelskr&a_id=A100702487&p_id=0000&l_id=RlLG&l_cd1=2&l_cd2=0"
  },
  {
    id: "interpark_grid",
    name: "NOL 인터파크투어",
    link: "https://click.linkprice.com/click.php?m=interpark3&a=A100702487&l=PxPz&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/interpark3/20241121/673ef9bdda6d5_120x60.png",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=interpark3&a_id=A100702487&p_id=0000&l_id=PxPz&l_cd1=2&l_cd2=0"
  },
  {
    id: "airalo_grid",
    name: "Airalo (eSIM)",
    link: "https://click.linkprice.com/click.php?m=airalo&a=A100702487&l=iNdp&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/airalo/20230406/e00xVgcWzw680_120_60.png",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=airalo&a_id=A100702487&p_id=0000&l_id=iNdp&l_cd1=2&l_cd2=0"
  },
  {
    id: "rentalcars_grid",
    name: "렌탈카스",
    link: "https://click.linkprice.com/click.php?m=rentalcars&a=A100702487&l=0010&u_id=",
    imgUrl: "http://img.linkprice.com/files/glink/rentalcars/20180607/5b18e34c5a1dc_120_60.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=rentalcars&a_id=A100702487&p_id=0000&l_id=0010&l_cd1=2&l_cd2=0"
  },
  {
    id: "usimsa_grid",
    name: "유심사",
    link: "https://click.linkprice.com/click.php?m=usimsa&a=A100702487&l=ebuY&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/usimsa/20250415/67fe1b8610f28_120x60.jpg",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=usimsa&a_id=A100702487&p_id=0000&l_id=ebuY&l_cd1=2&l_cd2=0"
  },
  {
    id: "yanolja_grid",
    name: "야놀자",
    link: "https://click.linkprice.com/click.php?m=yanolja&a=A100702487&l=Ai73&u_id=",
    imgUrl: "https://img.linkprice.com/files/glink/yanolja/20250422/0000CsmG00000_NOL_banner_120x60.png",
    trackingUrl: "http://track.linkprice.com/lpshow.php?m_id=yanolja&a_id=A100702487&p_id=0000&l_id=Ai73&l_cd1=2&l_cd2=0"
  }
];