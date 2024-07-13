FROM public.ecr.aws/lambda/python:3.12.2024.03.21.19-x86_64

COPY app.py .
COPY data.json .

COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["app.handler"]

