from scapy.all import * 

print("Packet details")

IpLayer = IP()
IpLayer.src = "10.0.2.6"
IpLayer.dst = "10.0.2.111"

IcmpPkt = ICMP()
pkt = IpLayer / IcmpPkt
pkt.show()

send(pkt, verbose=0)
print("packet sent")