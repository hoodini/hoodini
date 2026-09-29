import numpy as np, wave
SR=44100;DUR=120;N=SR*DUR
rng=np.random.default_rng(7)
out=np.zeros(N,dtype=np.float64)
def add(t,sig,g=1.0):
    i=int(t*SR)
    if i>=N: return
    j=min(N,i+len(sig)); out[i:j]+=sig[:j-i]*g
def env(n,a=.002,d=.2):
    t=np.arange(n)/SR; e=np.minimum(t/a,1)*np.exp(-t/d); return e
def kick():
    n=int(.35*SR);t=np.arange(n)/SR;f=45+90*np.exp(-t*28);ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*9)*1.0+ .15*np.sin(ph*2)*np.exp(-t*20)
def clap():
    n=int(.22*SR);x=rng.standard_normal(n);x=x-np.convolve(x,np.ones(6)/6,'same')
    t=np.arange(n)/SR;e=np.exp(-t*22)*(1+.8*(np.sin(2*np.pi*90*t)>0)*np.exp(-t*60));return x*e*.9
def hat(o=False):
    n=int((.18 if o else .05)*SR);x=rng.standard_normal(n);x=np.diff(x,prepend=0);t=np.arange(n)/SR
    return x*np.exp(-t*(18 if o else 70))*.35
def bass(f,d):
    n=int(d*SR);t=np.arange(n)/SR;s=np.sign(np.sin(2*np.pi*f*t))*.5+np.sin(2*np.pi*f*t)
    s=np.convolve(s,np.ones(20)/20,'same');return s*env(n,.005,d*.9)*.55
def pluck(f,d=.22):
    n=int(d*SR);t=np.arange(n)/SR;s=np.sin(2*np.pi*f*t)+.4*np.sin(4*np.pi*f*t)+.2*np.sin(6*np.pi*f*t)
    return s*env(n,.002,.09)*.22
def whoosh(d=.55):
    n=int(d*SR);t=np.arange(n)/SR;x=rng.standard_normal(n)
    y=np.zeros(n);k=1
    # sweeping lowpass via time-varying one-pole
    a=np.linspace(.02,.6,n)**1.3;s=0
    for i in range(n):
        s+=a[i]*(x[i]-s);y[i]=s
    e=(t/d)**2.2*np.exp(-((t/d)**6)*.0)*(1-np.clip((t-d*.85)/(d*.15),0,1))
    return y*e*4.0
def blip(f=880,d=.08):
    n=int(d*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*f*t*(1+.5*t/d))*np.exp(-t*40)*.25
BEAT=.5
roots=[55.0,43.65,65.41,49.0]
chords=[[220,261.63,329.63,440],[174.61,220,261.63,349.23],[261.63,329.63,392,523.25],[196,246.94,293.66,392]]
def level(t):
    return (1,1,1,1,1) if t>4 else (0,0,1,0,0)
nb=int(DUR/BEAT)
for b in range(nb):
    t=b*BEAT;k,c,h,ba,ar=level(t);bar=int(t/2)%4
    if k: add(t,kick(),.9)
    if c and b%4 in(1,3): add(t,clap(),.55)
    if h:
        add(t+.25,hat(),1); 
        if b%4==3: add(t+.25,hat(True),.7)
    if ba:
        add(t,bass(roots[bar],BEAT*.9),.9); add(t+.25,bass(roots[bar]*2,BEAT*.4),.5) if b%2 else None
    if ar:
        ch=chords[bar]
        for s in range(2):
            add(t+s*.25,pluck(ch[(b*2+s)%4]*(2 if (b+s)%3==0 else 1)),1)
bounds=[6.94, 16.12, 26.82, 35.04, 43.34, 50.6, 55.62, 67.2, 75.42, 82.2, 95.06, 109.28]
for t in bounds: add(max(0,t-.5),whoosh(),.5)
# section boundaries: impact
for t in bounds: add(t,kick(),1.0)
# typing ticks in prompt scene (68.5..)
# fade out & normalize
fo=np.clip((DUR-out.size/SR*0-np.arange(N)/SR)/1.8,0,1);out*=fo*0.55
# sidechain-ish light compression & normalize
out=np.tanh(out*1.2);out/=np.max(np.abs(out));out*=.85
pcm=(out*32767).astype('<i2')
with wave.open('music.wav','wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
print('ok')
