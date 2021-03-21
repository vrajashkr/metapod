const SecurityRules = [
   {
       "key": "NET_RAW",
       "title": "Drop NET_RAW",
       "desc": "Drop capability to create RAW Packets inside the container. Reduces the risk of an internal DOS attack",
   },
   {
       "key": "MKNOD",
       "title": "Drop MKNOD",
       "desc": "Drop capability to create devices inside the container.",
   },
   {
       "key": "DAC_OVERRIDE",
       "title": "Drop DAC_OVERRIDE",
       "desc": "Drop capability to override access control using root user."
   }
];

export default SecurityRules;