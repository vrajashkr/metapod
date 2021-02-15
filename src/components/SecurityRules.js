const SecurityRules = [
   {
       "title": "Drop NET_RAW",
       "desc": "Drop capability to create RAW Packets inside the container. Reduces the risk of an internal DOS attack",
   },
   {
       "title": "Drop MKNOD",
       "desc": "Drop capability to create devices inside the container.",
   }
];

export default SecurityRules;