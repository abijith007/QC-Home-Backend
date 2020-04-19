func test { 
[Rx(pi/4),Ry(pi/8)]
[X]
}

quReg qr = new quReg[2]
setPrecision(4)

qr.test()
qr.Pnz()